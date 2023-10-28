import {ApiGatewayManagementApi} from 'aws-sdk';

export const sendMessageToClient = async (endpoint: string, connectionId: string, message: string) => {
    const apiGwManagementApi = new ApiGatewayManagementApi({
        apiVersion: '2018-11-29',
        endpoint: `https://${endpoint}`,
    });
    try {
        await apiGwManagementApi.postToConnection({
            ConnectionId: connectionId,
            Data: message,
        });
        console.log('Message sent to connection', connectionId);
    } catch (e) {
        console.error('Error sending message to connection', connectionId, e);
    }
};
