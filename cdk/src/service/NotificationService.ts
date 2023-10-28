import {ApiGatewayManagementApi} from 'aws-sdk';
import {planningPokerRepository} from "../repository/PlanningPokerRepository";


export class NotificationService {
    private apiGwManagementApi: ApiGatewayManagementApi;

    constructor(endpoint: string) {
        this.apiGwManagementApi = new ApiGatewayManagementApi({
            apiVersion: '2018-11-29',
            endpoint: `https://${endpoint}`,
        });
    }

    async notifyCurrentUsers(roomId: string, shouldReset: boolean = false) {
        try {
            const users = await planningPokerRepository.findUsersInRoom(roomId);
            await Promise.all(
                users.map(user =>
                    this.apiGwManagementApi.postToConnection({
                        ConnectionId: user.clientId,
                        Data: JSON.stringify({shouldReset, users}),
                    }).promise())
            );
        } catch (e) {
            console.error('Error sending message to connection', e);
        }
    }
}
