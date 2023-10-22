import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";

class PlapoRepository {
    private docClient: DynamoDBDocumentClient;
    constructor() {
        const client = new DynamoDBClient({
            endpoint: 'http://dynamodb:8000/',
            region: 'ap-northeast-1',
            credentials: {accessKeyId: 'FAKE', secretAccessKey: 'FAKE'},
        });
        this.docClient = DynamoDBDocumentClient.from(client);
    }
    getItemsInRoom = async (roomId: string) => {
        const command = new QueryCommand({
            TableName: 'PlanningPoker',
            KeyConditionExpression: "roomId = :value",
            ExpressionAttributeValues: {
                ":value": roomId
            }
        });
        return await this.docClient.send(command);
    }

    getItemInRoomAndUser = async (roomId: string, userId: string) => {
        const command = new GetCommand({
            TableName: 'PlanningPoker',
            Key: {
                roomId: roomId,
                userId: userId
            }
        });
        return await this.docClient.send(command);
    }

    putItemInRoomAndUser = async (roomId: string, userName: string, userId: string, cardNumber: string | null) => {
        const command = new PutCommand({
            TableName: 'PlanningPoker',
            Item: {
                roomId: roomId,
                userId: userId,
                userName: userName,
                cardNumber: cardNumber ? cardNumber : "",
            }
        });
        return await this.docClient.send(command);
    }

    deleteUserInRoom = async (roomId: string, userId: string) => {
        const command = new DeleteCommand({
            TableName: 'PlanningPoker',
            Key: {
                roomId: roomId,
                userId: userId,
            }
        });
        return await this.docClient.send(command);
    }

    updateCardNumberInRoomAndUser = async (roomId: string, userId: string, cardNumber: string | null) => {
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
        return await this.docClient.send(command);
    }

    updateAllCardNumberInRoom = async (roomId: string, cardNumber: string | null) => {
        console.log(`Updating all card numbers in room ${roomId} to ${cardNumber}`);
        const itemsInRoom = await this.getItemsInRoom(roomId);
        for (const item of itemsInRoom.Items?.filter(item => item.cardNumber !== cardNumber) ?? []) {
            await this.updateCardNumberInRoomAndUser(roomId, item.userId, cardNumber);
        }
    }
}

export default PlapoRepository;
