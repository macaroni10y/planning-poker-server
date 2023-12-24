# planning-poker-server

A simple planning poker server written in TypeScript using AWS SDK for Node.js.  
This server is intended to be used with the [planning-poker-front](https://github.com/macaroni10y/planning-poker-front).

## Hosting

This server is hosted on AWS Lambda and uses DynamoDB for data storage.

## Infrastructure

The infrastructure is defined using AWS Cloud Development Kit (CDK) and can be found in the `cdk` directory.

## Testing

Tests are written using Jest and can be found in the `tests` directory.

- `tests/functions` contains unit tests for the functions in `src/functions`
- `tests/integration` contains integration tests for the API endpoints
