import {exec, execSync} from "child_process";

module.exports = async () => {
    console.log('Starting DynamoDB Local...');
    execSync('docker compose -f tests/integration/compose.yaml up -d');
    console.log('Starting SAM Local...');
    execSync('npm run cdk synth -- --no-staging');
    console.log('Starting SAM Local api...');
    exec('sam local start-api -t cdk.out/AdminApiStack.template.json --docker-network lambda-local');
};
