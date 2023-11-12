import {execSync} from "child_process";
import * as fs from "fs";

module.exports = async () => {
    console.log('Stopping DynamoDB Local...');
    execSync('docker stop $(docker ps -q --filter "ancestor=amazon/dynamodb-local")');
    const pid = fs.readFileSync('sam-local.pid', 'utf8');
    try {
        execSync(`kill ${pid}`);
        execSync(`rm sam-local.pid`);
        console.log(`Stopped SAM Local (PID: ${pid})`);
    } catch (e) {
        console.error(`Failed to stop SAM Local (PID: ${pid}): ${e}`);
    }
};
