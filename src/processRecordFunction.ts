import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid';
import { SNSClient,PublishCommand } from "@aws-sdk/client-sns";
import { SchedulerClient,CreateScheduleCommand, FlexibleTimeWindowMode } from "@aws-sdk/client-scheduler";

interface RecordPayload {
    valid: boolean;
    value: number;
    description: string;
    buyer: string;
}

const dynamodb = new DynamoDBClient();
 const snsClient = new SNSClient();
const schedulerClient = new SchedulerClient();



export const handler = async(event:APIGatewayProxyEvent) =>{
    console.log(`Initial Request: ${JSON.stringify(event)}`);
     console.log(`ENV Request: ${JSON.stringify(process.env)}`);
   
    const tableName = process.env.TABLE_NAME!;
    const topicArn = process.env.TOPIC_ARN!;
  
    const recordPayload:RecordPayload = JSON.parse(event.body!);
   
    const timestmp = getTimestamp();

    //Validate json only using isValid field. 
    //More complex conditions can be added based on the other fields of the JSON

    if (recordPayload.valid) {
        //send email with the payload
       

        const publishCommand = new PublishCommand({
        TopicArn: topicArn,
        Message: event.body || ""
        });

        const rs = await snsClient.send(publishCommand);

        return {
            statusCode:200,
            body: JSON.stringify({
            message:'Provided JSON is valid. You will receive and email with details}'
        })
        }
    } else {
        //store the JSON in 
        const invalidRecordUuid = uuidv4();
      const putItemCommand = new PutItemCommand({
        Item:{
            PK:{
                S:`Item#${invalidRecordUuid}`
            },
            SK:{
                S:`Metadata#${invalidRecordUuid}`
            },
            payload:{
                S: JSON.stringify(recordPayload)
            },
            timestamp:{
                S:timestmp
            }
        },
        ReturnConsumedCapacity:"TOTAL",
        TableName:tableName
    })

     const clientResponse = await dynamodb.send(putItemCommand);
    
        const utcString = getMinutesOffsetDate(30, new Date());
        
        const eventDetails = {
            uuid: invalidRecordUuid,
            payload: JSON.stringify(recordPayload),
            addedAt:timestmp
        }
        
    const scheduleParams = {
      Name: `scheduleEvent${invalidRecordUuid}`,
      ScheduleExpression: `at(${utcString})`,
      Target: {
        Arn: `arn:aws:lambda:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT}:function:${process.env.SCHEDULED_FUNC_ARN}`, 
        RoleArn: `arn:aws:iam::${process.env.AWS_REGION}:role/LambdaExecutionRole`, 
        Input: JSON.stringify(eventDetails)
      },
        FlexibleTimeWindow: { Mode: FlexibleTimeWindowMode.OFF }
      
        };

        console.log(`Scheduled params:${JSON.stringify(scheduleParams)}`);
        
        try{const scheduleResult = await schedulerClient.send(new CreateScheduleCommand(scheduleParams));
            console.log("EventBridge schedule created:", scheduleResult);
        } catch (e) {
            console.log(`Error scheduling for deletion.Error details ${JSON.stringify(e)}`)
        }

    
    
    return {
        statusCode:200,
        body: JSON.stringify({
        message:'Your record is invalid. It has been scheduled for deletion'
      })
    }
    }

   

    
   
}



function getTimestamp():string {
    const event = new Date();
    return event.toJSON();
}

function getMinutesOffsetDate (minutes:number, date = new Date()) {  
  if (typeof minutes !== 'number') {
    throw new Error('Invalid "minutes" argument')
  }

  if (!(date instanceof Date)) {
    throw new Error('Invalid "date" argument')
  }

  date.setMinutes(date.getMinutes() + minutes)

  return date.toJSON()
}
