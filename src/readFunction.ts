import { DynamoDBClient, GetItemCommand,QueryCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

// const randomNumberQueryStr = process.env.SECONDARY_INDEX_NAME || "randomNumber";
// const dynamodb = new DynamoDBClient();

export const handler = async(event:APIGatewayProxyEvent) =>{
    console.log(`Event log get orders by random number: ${JSON.stringify(event)}`)
    // const tableName = process.env.TABLE_NAME!;

    // if(!event.queryStringParameters|| !event.queryStringParameters[randomNumberQueryStr] ||  event.queryStringParameters[randomNumberQueryStr]==="" ){
    //     return {
    //           statusCode:200,
    //           body: JSON.stringify({
    //         message:"Please provide random number!"
    //     })
    //     }
    // }

    // const randomNumbrToGet =event.queryStringParameters && event.queryStringParameters[randomNumberQueryStr] ;

    // const queryCommand = new QueryCommand({ 
    //     TableName:tableName,
    //     IndexName: randomNumberQueryStr,
    //    ExpressionAttributeValues: {
    //        ":rn": {
    //           S: randomNumbrToGet
    //         }
    //    },
    //   KeyConditionExpression: `${randomNumberQueryStr} = :rn` ,
    //     })
  
//console.log(`Client request params: ${JSON.stringify(queryCommand)}`);

//    const clientResponse = await dynamodb.send(queryCommand);
//console.log(`Client response: ${JSON.stringify(clientResponse)}`);
    return {
        statusCode:200,
        body: JSON.stringify({
            message:JSON.stringify({"body":{}})
        })
    }
}