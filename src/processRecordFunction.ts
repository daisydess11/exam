import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid';
import { SNSClient,PublishCommand } from "@aws-sdk/client-sns";

interface RecordPayload {
    valid: boolean;
    value: number;
    description: string;
    buyer: string;
}

const dynamodb = new DynamoDBClient();
 const snsClient = new SNSClient();

const invalidRecordUuid = uuidv4();



export const handler = async(event:APIGatewayProxyEvent) =>{
    console.log(`Initial Request: ${JSON.stringify(event)}`)
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

