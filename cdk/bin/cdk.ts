#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import "source-map-support/register";
import { AdminApiStack } from "../lib/admin-api-stack";
import { PlanningPokerServerStack } from "../lib/planning-poker-server-stack";

const app = new cdk.App();
const planningPokerServerStack = new PlanningPokerServerStack(
	app,
	"PlanningPokerServerStack",
);
new AdminApiStack(app, "AdminApiStack", {
	table: planningPokerServerStack.table,
});
