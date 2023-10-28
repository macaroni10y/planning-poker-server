#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PlanningPokerServerStack } from '../lib/planning-poker-server-stack';

const app = new cdk.App();
new PlanningPokerServerStack(app, 'PlanningPokerServerStack');
