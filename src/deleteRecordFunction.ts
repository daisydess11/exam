import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient,PublishCommand } from "@aws-sdk/client-sns";

const dynamodb = new DynamoDBClient();
const snsClient = new SNSClient();
 

interface eventPayload {
    uuid: string;
    payload: string;
    addedAt: string;
}
export const handler = async(event:eventPayload) =>{
    console.log(`Event log : ${JSON.stringify(event)}`)
    const tableName = process.env.TABLE_NAME!;
    const topicArn = process.env.TOPIC_ARN;
    /*{
    "uuid": "Item#84b529cb-4d07-4c09-932c-ace8ce6d6b46",
    "payload": "{\"valid\":false,\"value\":0,\"description\":\"Hacker attack 10\",\"buyer\":\"someobody 3\"}",
    "addedAt": "2025-08-03T07:46:51.708Z"
}
     */

    const { uuid, payload, addedAt } = event;

    const deleteItemCommand = new DeleteItemCommand({
        TableName: tableName,
        Key: {
            PK: {
                S:uuid
            }
        }
    })

    console.log(`delete command: ${JSON.stringify(deleteItemCommand)}`);

    
    const clientResponse = await dynamodb.send(deleteItemCommand);
    
    //send notif
    const notifPayload = {
        jsonPayload: payload,
        stayTime:""
    }
      const publishCommand = new PublishCommand({
            TopicArn: topicArn,
            Message: JSON.stringify(notifPayload)
            });
    
    const rs = await snsClient.send(publishCommand);
    
console.log(`Client response: ${JSON.stringify(clientResponse)}`);
    return {
        statusCode:200,
        body: JSON.stringify({
            message:JSON.stringify({"body":{}})
        })
    }
}