#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PlanningPokerServerStack } from '../lib/planning-poker-server-stack';
import {AdminApiStack} from "../lib/admin-api-stack";

const app = new cdk.App();
const planningPokerServerStack = new PlanningPokerServerStack(app, 'PlanningPokerServerStack');
new AdminApiStack(app, 'AdminApiStack', {
    table: planningPokerServerStack.table,
});
