import { exec, execSync } from "node:child_process";
import * as fs from "node:fs";

module.exports = async () => {
	console.log("Starting DynamoDB Local...");
	execSync("docker compose -f tests/integration/compose.yaml up -d");
	console.log("Starting SAM Local...");
	execSync("npm run cdk synth -- --no-staging");
	console.log("Starting SAM Local api...");
	const samLocal = exec(
		"sam local start-api -t cdk.out/AdminApiStack.template.json --docker-network lambda-local",
	);
	fs.writeFileSync("sam-local.pid", samLocal?.pid?.toString());
};
