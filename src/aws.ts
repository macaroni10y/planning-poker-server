import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";

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

export const getItemInRoomAndUser = async (roomId: string, userId: string) => {
    const command = new GetCommand({
        TableName: 'PlanningPoker',
        Key: {
            roomId: roomId,
            userId: userId
        }
    });
    return await docClient.send(command);
}

export const putItemInRoomAndUser = async (roomId: string, userName: string, userId: string, cardNumber: string | null) => {
    const command = new PutCommand({
        TableName: 'PlanningPoker',
        Item: {
            roomId: roomId,
            userId: userId,
            userName: userName,
            cardNumber: cardNumber ? cardNumber : "",
        }
    });
    return await docClient.send(command);
}

export const deleteUserInRoom = async (roomId: string, userId: string) => {
    const command = new DeleteCommand({
        TableName: 'PlanningPoker',
        Key: {
            roomId: roomId,
            userId: userId,
        }
    });
    return await docClient.send(command);
}

export const updateCardNumberInRoomAndUser = async (roomId: string, userId: string, cardNumber: string | null) => {
    const command = new UpdateCommand({
        TableName: 'PlanningPoker',
        Key: {
            roomId: roomId,
            userId: userId
        },
        UpdateExpression: "set cardNumber = :c",
        ExpressionAttributeValues: {
            ":c": cardNumber ? cardNumber : "",
        }
    });
    return await docClient.send(command);
}

export const updateAllCardNumberInRoom = async (roomId: string, cardNumber: string | null) => {
    const command = new UpdateCommand({
        TableName: 'PlanningPoker',
        Key: {
            roomId: roomId,
        },
        UpdateExpression: "set cardNumber = :c",
        ExpressionAttributeValues: {
            ":c": cardNumber ? cardNumber : "",
        }
    });
    return await docClient.send(command);
}
