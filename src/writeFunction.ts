import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid';
import { SNSClient,PublishCommand } from "@aws-sdk/client-sns";


// const dynamodb = new DynamoDBClient();
// const snsClient = new SNSClient();

// function getRandomInt(max:number):number {
//         return Math.floor(Math.random() * max);
//     }

// function getTimestamp():string {
//     const event = new Date();
//     return event.toJSON();
// }

const examUuid = uuidv4();


export const handler = async(event:APIGatewayProxyEvent) =>{
    console.log(`Event log: ${JSON.stringify(event)}`)
    // const tableName = process.env.TABLE_NAME!;
    // const topicArn = process.env.TOPIC_ARN!;
    // const randNum = getRandomInt(100);
    // const timestmp = getTimestamp();

    // const putItemCommand = new PutItemCommand({
    //     Item:{
    //         PK:{
    //             S:`Item#${examUuid}`
    //         },
    //         SK:{
    //             S:'Metadata#${examUuid}'
    //         },
    //         randomNumber:{
    //             S: randNum.toString()
    //         },
    //         timestamp:{
    //             S:timestmp
    //         }
    //     },
    //     ReturnConsumedCapacity:"TOTAL",
    //     TableName:tableName
    // })

    // const clientResponse = await dynamodb.send(putItemCommand);

    // const publishCommand = new PublishCommand({
    //   TopicArn: topicArn,
    //   Message: JSON.stringify({
    //     msg: `Your order has been placed. Your random number is ${randNum}, timestamp:${timestmp}.`
    //   }),
    // });

    // const rs = await snsClient.send(publishCommand);

    return {
        statusCode:200,
        body: JSON.stringify({
            message:'Your order has been placed.'
        })
    }
}