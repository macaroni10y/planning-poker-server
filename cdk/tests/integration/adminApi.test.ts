import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    endpoint: "http://localhost:8000",
    region: "ap-northeast-1",
});
const docClient = DynamoDBDocumentClient.from(client);
beforeAll(async () => {
    console.log("Creating table...");
    await docClient.send(
        new CreateTableCommand({
            TableName: "PlanningPoker",
            AttributeDefinitions: [
                {
                    AttributeName: "roomId",
                    AttributeType: "S",
                },
                {
                    AttributeName: "clientId",
                    AttributeType: "S",
                },
            ],
            KeySchema: [
                {
                    AttributeName: "roomId",
                    KeyType: "HASH",
                },
                {
                    AttributeName: "clientId",
                    KeyType: "RANGE",
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
            GlobalSecondaryIndexes: [
                {
                    IndexName: "ClientIdIndex",
                    KeySchema: [
                        {
                            AttributeName: "clientId",
                            KeyType: "HASH",
                        },
                    ],
                    Projection: {
                        ProjectionType: "ALL",
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 1,
                        WriteCapacityUnits: 1,
                    },
                },
            ],
        }),
    );
    await docClient
        .send(
            new PutCommand({
                TableName: "PlanningPoker",
                Item: {
                    roomId: "__room_id__",
                    clientId: "__client_id__",
                    userName: "__user_name__",
                    cardNumber: "3",
                },
            }),
        )
        .then(console.log);
    await new Promise((resolve) => setTimeout(resolve, 10000));
}, 100000);

afterEach(async () => {
    await docClient.send(
        new DeleteCommand({
            TableName: "PlanningPoker",
            Key: {
                roomId: "__room_id__",
                clientId: "__client_id__",
            },
        }),
    );
});

describe("Admin API", () => {
    it("should return 200 when getting users in room", async () => {
        const response = await fetch(
            "http://127.0.0.1:3000/users?roomId=__room_id__",
        );
        const json = await response.json();
        console.log(json);
        expect(response.status).toBe(200);
        expect(json).toEqual([
            {
                roomId: "__room_id__",
                clientId: "__client_id__",
                name: "__user_name__",
                cardNumber: "3",
            },
        ]);
    }, 10000);
    it("should return 400 when getting users in room with missing roomId", async () => {
        const response = await fetch("http://127.0.0.1:3000/users");
        console.log(await response.text());
        expect(response.status).toBe(400);
    }, 10000);
});
