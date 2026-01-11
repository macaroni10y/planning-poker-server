export interface WebSocketAuthorizerEvent {
    queryStringParameters?: { [key: string]: string | undefined };
    requestContext: {
        connectionId?: string;
    };
}
