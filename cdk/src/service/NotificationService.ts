
import { ApiGatewayManagementApi } from "@aws-sdk/client-apigatewaymanagementapi";
import { planningPokerRepository } from "../repository/PlanningPokerRepository";

export class NotificationService {
	private apiGwManagementApi: ApiGatewayManagementApi;

	constructor(endpoint: string) {
		this.apiGwManagementApi = new ApiGatewayManagementApi({
			apiVersion: "2018-11-29",
			endpoint: `https://${endpoint}`,
		});
	}

	async notifyCurrentUsers(roomId: string, shouldReset = false) {
		try {
			const users = await planningPokerRepository.findUsersInRoom(roomId);
			const promises = users.map((user) =>
				this.apiGwManagementApi
					.postToConnection({
						ConnectionId: user.clientId,
						Data: JSON.stringify({ type: "updateCard", shouldReset, users }),
					})
					.catch(async (error) => {
						console.error({
							message: `The connection is already gone, deleting ${user.clientId}`,
							error,
						});
						await planningPokerRepository.deleteUser(roomId, user.clientId);
					}),
			);
			await Promise.allSettled(promises);
		} catch (e) {
			console.error("Error sending message to connection", e);
		}
	}

	/**
	 * notify users in specified room that someone reset timer
	 * @param type
	 * @param roomId
	 * @param time
	 */
	async notifyTimer(
		type: "resetTimer" | "pauseTimer" | "resumeTimer",
		roomId: string,
		time?: number,
	) {
		try {
			const users = await planningPokerRepository.findUsersInRoom(roomId);
			const promises = users.map((user) =>
				this.apiGwManagementApi
					.postToConnection({
						ConnectionId: user.clientId,
						Data: JSON.stringify({ type, time }),
					})
					.catch(async (error) => {
						console.error({
							message: `The connection is already gone, deleting ${user.clientId}`,
							error,
						});
						await planningPokerRepository.deleteUser(roomId, user.clientId);
					}),
			);
			await Promise.allSettled(promises);
		} catch (e) {
			console.error("Error sending message to connection", e);
		}
	}

	/**
	 * notify users one's reaction
	 * @param kind
	 * @param roomId
	 * @param clientId
	 */
	async notifyReaction(kind: string, roomId: string, clientId: string) {
		console.info({
			message: "notifyReaction",
			kind,
			roomId,
			clientId,
		});
		try {
			const users = await planningPokerRepository.findUsersInRoom(roomId);
			console.info({
				message: "users found",
				users,
			});
			const sender = users.find((user) => user.clientId === clientId);
			if (!sender) {
				console.warn({
					message: "sender not found",
					kind,
					roomId,
					clientId,
				});
				return;
			}
			const promises = users.map((user) =>
				this.apiGwManagementApi
					.postToConnection({
						ConnectionId: user.clientId,
						Data: JSON.stringify({ type: "reaction", kind, from: sender.name }),
					})
					.catch(async (error) => {
						console.error({
							message: `The connection is already gone, deleting ${user.clientId}`,
							error,
						});
						await planningPokerRepository.deleteUser(roomId, user.clientId);
					}),
			);
			await Promise.allSettled(promises);
		} catch (e) {
			console.error("Error sending message to connection", e);
		}
	}

	/**
	 * initialize timer for joined user
	 * @param type
	 * @param roomId
	 * @param clientId
	 * @param time
	 */
	async initTimer(
		type: "resumeTimer",
		roomId: string,
		clientId: string,
		time?: number,
	) {
		try {
			await this.apiGwManagementApi
				.postToConnection({
					ConnectionId: clientId,
					Data: JSON.stringify({ type, time }),
				})
				.catch(async (error) => {
					console.error({
						message: `The connection is already gone, deleting ${clientId}`,
						error,
					});
					await planningPokerRepository.deleteUser(roomId, clientId);
				});
		} catch (e) {
			console.error("Error sending message to connection", e);
		}
	}
}
