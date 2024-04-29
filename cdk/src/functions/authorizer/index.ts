import type { APIGatewayProxyEvent } from "aws-lambda";

const allowedOrigins = ["https://macaroni-poker.vercel.app"];

export const handler = async (event: APIGatewayProxyEvent) =>
	generatePolicy(
		event.requestContext.connectionId,
		allowedOrigins.includes(event.headers.Origin || ""),
	);

const generatePolicy = (
	principalId: string | undefined,
	isAllowed: boolean,
) => ({
	principalId: principalId,
	policyDocument: {
		Version: "2012-10-17",
		Statement: [
			{
				Action: "execute-api:Invoke",
				Effect: isAllowed ? "Allow" : "Deny",
				Resource:
					"arn:aws:execute-api:ap-northeast-1:417866577833:sjy1ekd1t6/*/*",
			},
		],
	},
});
