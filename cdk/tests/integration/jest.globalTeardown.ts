import {execSync} from "child_process";

module.exports = async () => {
    console.log('Stopping DynamoDB Local...');
    execSync('docker stop $(docker ps -q --filter "ancestor=amazon/dynamodb-local")');
};
