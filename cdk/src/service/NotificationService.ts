import { ApiGatewayManagementApi } from "aws-sdk";
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
					.promise()
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
					.promise()
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
				.promise()
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
