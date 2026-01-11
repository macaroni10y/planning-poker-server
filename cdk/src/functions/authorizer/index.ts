import type { APIGatewayAuthorizerResult } from "aws-lambda";
import { verifyToken } from "./jwtVerifier";
import { generatePolicy } from "./policyGenerator";
import type { WebSocketAuthorizerEvent } from "./types";

export const handler = async (
    event: WebSocketAuthorizerEvent,
): Promise<APIGatewayAuthorizerResult> => {
    console.info({
        message: "Authorizer invoked",
        connectionId: event.requestContext.connectionId,
    });

    try {
        const token = event.queryStringParameters?.token;

        if (!token) {
            console.warn({
                message: "No token provided in query parameters",
            });
            return generatePolicy(event.requestContext.connectionId, false);
        }

        const payload = await verifyToken(token);

        console.info({
            message: "Token verified successfully",
            sub: payload.sub,
            exp: payload.exp,
        });

        return generatePolicy(event.requestContext.connectionId, true, payload);
    } catch (error) {
        console.error({
            message: "Token verification failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
        return generatePolicy(event.requestContext.connectionId, false);
    }
};
