import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import { Tags } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import { BaseFunction } from './BaseFunction';


const secondaryIndex = 'timestamp';
const emailReceiver = "desislava.koshnicharova@gmail.com"

export class ExamTaskStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
   

    // sns topic and subscription for valid json

    const validRecordTopic = new sns.Topic(this, 'validRecordTopic');

    const validRecordSubscription = new sns.Subscription(this,'validRecordSubscription',{
      topic:validRecordTopic,
      protocol: sns.SubscriptionProtocol.EMAIL,
      endpoint:emailReceiver
    })

    Tags.of(validRecordSubscription).add('lecture', 'exam');
    Tags.of(validRecordTopic).add('lecture','exam');
     // sns topic and subscription for deleted json

    const deletedRecordTopic = new sns.Topic(this, 'deletedRecordTopic');

    const deletedRecordSubscription = new sns.Subscription(this,'deletedRecordSubscription',{
      topic:deletedRecordTopic,
      protocol: sns.SubscriptionProtocol.EMAIL,
      endpoint:emailReceiver
    })

    Tags.of(deletedRecordSubscription).add('lecture', 'exam');
    Tags.of(deletedRecordTopic).add('lecture', 'exam');
    
    // dynamodb table for invalid records
    const invalidRecordsTable = new Table(this, 'invalidRecords', {
      partitionKey:{
        name:'PK',
        type:AttributeType.STRING
      },
      sortKey:{
        name:'SK',
        type:AttributeType.STRING
      },
      tableName: 'invalidRecords',
      billingMode: BillingMode.PAY_PER_REQUEST
    })

    // invalidRecordsTable.addGlobalSecondaryIndex({
    //   partitionKey:{
    //     name:secondaryIndex,
    //     type:AttributeType.STRING
    //   },
    //   indexName:secondaryIndex
    // });
    
    Tags.of(invalidRecordsTable).add('lecture', 'exam');


     //Lambda functions process record
    const processRecordFunction = new BaseFunction(this, 'processRecordFunction',{
        TABLE_NAME:invalidRecordsTable.tableName,
        TOPIC_ARN: validRecordTopic.topicArn
      });
      

    invalidRecordsTable.grantWriteData(processRecordFunction);
    validRecordTopic.grantPublish(processRecordFunction);    


    //read table lambda 

     const deleteRecordFunction = new BaseFunction(this, 'deleteRecordFunction',{
       TABLE_NAME:invalidRecordsTable.tableName
      });
 

    invalidRecordsTable.grantReadData(deleteRecordFunction)


    //api implementation
    //     const orderApi = new RestApi(this,'OrderApi',{
    //   restApiName:'Orders'
    // })

    // const orderResource = orderApi.root.addResource('order');
    // orderResource.addMethod(HttpMethod.GET, new LambdaIntegration(readFunction, {
    //   proxy:true
    // }));
  }
  
}
