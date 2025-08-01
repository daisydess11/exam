import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import { Bucket,EventType,BucketProps } from 'aws-cdk-lib/aws-s3';
import { Tags } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { BaseFunction } from './BaseFunction';


const secondaryIndex = 'secondaryIndex';

export class ExamTaskStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    
    // const pathLib = "/exam-files";

    // const bucketProps: BucketProps = {
    //   bucketName: `exam-files`,
    //   websiteIndexDocument: 'index.html',
    //   publicReadAccess: true,
    //   blockPublicAccess: {
    //     blockPublicAcls: false,
    //     blockPublicPolicy: false,
    //     ignorePublicAcls: false,
    //     restrictPublicBuckets: false,
    //   }

    // };

    // const staticWebsiteBucket = new Bucket(this, 'exam-bucket', bucketProps);

    // //upload index.html into the bucket 
    // const deployment = new s3Deployment.BucketDeployment(
    //   this,
    //   'deployExamBucket',
    //   {
    //     sources: [s3Deployment.Source.asset(__dirname + '/' + pathLib)],
    //     destinationBucket: staticWebsiteBucket,
    //   }
    // );
 
    // Tags.of(staticWebsiteBucket).add('lecture', 'exam');
    
  

    // sns topic and subscription

    //   const examTopic = new sns.Topic(this, 'examTopic');

    // const examSubscription = new sns.Subscription(this,'examTopic',{
    //   topic:examTopic,
    //   protocol: sns.SubscriptionProtocol.EMAIL,
    //   endpoint:"desislava.koshnicharova@gmail.com"
    // })

    // dynamodb table
       const examTable = new Table(this, 'examTable', {
      partitionKey:{
        name:'PK',
        type:AttributeType.STRING
      },
      sortKey:{
        name:'SK',
        type:AttributeType.STRING
      },
      tableName:'examTable'
    })

    examTable.addGlobalSecondaryIndex({
      partitionKey:{
        name:secondaryIndex,
        type:AttributeType.STRING
      },
      indexName:secondaryIndex
    });


    //write in table lambda
    
     //Lambda functions
    const writeFunction = new BaseFunction(this, 'writeFunction',{
        TABLE_NAME:examTable.tableName,
        //TOPIC_ARN: examTopic.topicArn
      });
      

    examTable.grantWriteData(writeFunction);
    //examTopic.grantPublish(writeFunction);
    
    //read table lambda

     const readFunction = new BaseFunction(this, 'readFunction',{
       TABLE_NAME:examTable.tableName,
        SECONDARY_INDEX_NAME: secondaryIndex,
      });
 

    examTable.grantReadData(readFunction)


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
