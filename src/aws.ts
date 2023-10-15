import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
    endpoint: 'http://dynamodb:8000/',
    region: 'ap-northeast-1',
    credentials: {accessKeyId: 'FAKE', secretAccessKey: 'FAKE'},
});
export const docClient = DynamoDBDocumentClient.from(client);


export const getItemsInRoom = async (roomId: string) => {
    const command = new QueryCommand({
        TableName: 'PlanningPoker',
        KeyConditionExpression: "roomId = :value",
        ExpressionAttributeValues: {
            ":value": roomId
        }
    });
    return await docClient.send(command);
}

export const getItemInRoomAndPlayer = async (roomId: string, playerTimestamp: string) => {
    const command = new GetCommand({
        TableName: 'PlanningPoker',
        Key: {
            roomId: roomId,
            playerTimestamp: playerTimestamp
        }
    });
    return await docClient.send(command);
}

export const putItemInRoomAndPlayer = async (roomId: string, playerName: string, playerTimestamp: string, cardNumber: string | null) => {
    console.log(roomId);
    console.log(playerName);
    console.log(cardNumber);
    const command = new PutCommand({
        TableName: 'PlanningPoker',
        Item: {
            roomId: roomId,
            playerTimestamp: playerTimestamp,
            playerId: playerName,
            cardNumber: cardNumber? cardNumber: "",
        }
    })
    return await docClient.send(command);
}

export const updateItemInRoomAndPlayer = async (roomId: string, playerTimestamp: string, cardNumber: string) => {
    const command = new UpdateCommand({
        TableName: 'PlanningPoker',
        Key: {
            roomId: roomId,
            playerTimestamp: playerTimestamp
        },
        UpdateExpression: "set cardNumber = :c",
        ExpressionAttributeValues: {
            ":c": cardNumber
        }
    });
    return await docClient.send(command);
}
