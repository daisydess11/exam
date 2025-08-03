import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";
import { FunctionOptions } from "aws-cdk-lib/aws-lambda";

interface BaseFunctionProps {
    TABLE_NAME: string;
    TOPIC_ARN?: string;
}

export class BaseFunction extends NodejsFunction {
    constructor(scope: Construct, id:string,props:{[key:string]:string}){
        super(scope, id, {
            ...props,
            handler:'handler',
            timeout:Duration.seconds(5),
            entry: `${__dirname}/../src/${id}.ts`,
            environment:props
        })
    }
}