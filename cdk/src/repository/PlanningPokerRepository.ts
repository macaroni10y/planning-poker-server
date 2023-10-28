import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";


interface User {
    roomId: string;
    clientId: string;
    name: string;
    cardNumber: string | null;
}

class PlanningPokerRepository {
    private docClient: DynamoDBDocumentClient;

    constructor() {
        const client = new DynamoDBClient();
        this.docClient = DynamoDBDocumentClient.from(client);
    }

    findUsersInRoom = async (roomId: string): Promise<User[]> => {
        const command = new QueryCommand({
            TableName: 'PlanningPoker',
            KeyConditionExpression: "roomId = :value",
            ExpressionAttributeValues: {
                ":value": roomId
            }
        });
        const output = await this.docClient.send(command);
        return output.Items?.map(item => ({
            roomId: item.roomId,
            clientId: item.clientId,
            name: item.userName,
            cardNumber: item.cardNumber
        })) ?? [];
    }

    findUserById = async (clientId: string): Promise<User | undefined> => {
        const command = new QueryCommand({
            TableName: 'PlanningPoker',
            IndexName: 'ClientIdIndex',
            KeyConditionExpression: "clientId = :value",
            ExpressionAttributeValues: {
                ":value": clientId
            }
        });
        const output = await this.docClient.send(command);
        return output.Items && output.Items.length !== 0 ? {
            roomId: output.Items[0].roomId,
            clientId: output.Items[0].clientId,
            name: output.Items[0].userName,
            cardNumber: output.Items[0].cardNumber
        } : undefined;
    }

    registerUser = async (user: User): Promise<void> => {
        const command = new PutCommand({
            TableName: 'PlanningPoker',
            Item: {
                roomId: user.roomId,
                clientId: user.clientId,
                userName: user.name,
                cardNumber: user.cardNumber ? user.cardNumber : "",
            }
        });
        await this.docClient.send(command);
    }

    deleteUser = async (roomId: string, clientId: string): Promise<void> => {
        const command = new DeleteCommand({
            TableName: 'PlanningPoker',
            Key: {
                roomId,
                clientId
            }
        });
        await this.docClient.send(command);
    }

    updateCardNumberInRoomAndUser = async (roomId: string, clientId: string, cardNumber: string | null): Promise<void> => {
        const command = new UpdateCommand({
            TableName: 'PlanningPoker',
            Key: {
                roomId: roomId,
                clientId: clientId
            },
            UpdateExpression: "set cardNumber = :c",
            ExpressionAttributeValues: {
                ":c": cardNumber ? cardNumber : "",
            }
        });
        await this.docClient.send(command);
    }

    updateAllCardNumberInRoom = async (roomId: string, cardNumber: string | null): Promise<void> => {
        console.log(`Updating all card numbers in room ${roomId} to ${cardNumber}`);
        const usersInRoom = await this.findUsersInRoom(roomId);
        const updatePromises = usersInRoom.map(user =>
            this.updateCardNumberInRoomAndUser(user.roomId, user.clientId, cardNumber)
        );
        await Promise.all(updatePromises);
    }
}

export const planningPokerRepository = new PlanningPokerRepository();
export type {User};
