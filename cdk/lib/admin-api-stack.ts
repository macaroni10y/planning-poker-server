import {Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Table} from "aws-cdk-lib/aws-dynamodb";
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {NodejsFunction} from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

interface Props extends StackProps {
    table: Table;
}

export class AdminApiStack extends Stack {
    constructor(scope: Construct, id: string, props: Props) {
        super(scope, id, props);
        const lambda = new NodejsFunction(this, 'AdminApiHandler', {
            entry: path.join(__dirname, '../src/functions/admin-api/index.ts'),
        });

        const api = new RestApi(this, 'AdminApi', {
            restApiName: 'AdminApi',
        });
        api.root.addResource('users')
            .addMethod('GET', new LambdaIntegration(lambda));
        props.table.grantReadData(lambda);
    }
}