import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { Duration } from "aws-cdk-lib";

interface BaseFunctionProps {
    TABLE_NAME: string;
    SECONDARY_INDEX_NAME?: string;
    TOPIC_ARN?: string;
}

export class BaseFunction extends NodejsFunction {
    constructor(scope: Construct, id:string,props:BaseFunctionProps){
        super(scope, id, {
            ...props,
            handler:'handler',
            timeout:Duration.seconds(5),
            entry:`${__dirname}/../src/${id}.ts`
        })
    }
}