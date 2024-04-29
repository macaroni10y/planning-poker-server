import { planningPokerRepository } from "../../repository/PlanningPokerRepository";
import type { RevealAllCardsParams } from "../../types/actionParams";

/**
 * set all card numbers to 'skip' for users who have not yet voted
 * @param body
 */
export const revealAllCards = async (body: RevealAllCardsParams) => {
	const users = await planningPokerRepository.findUsersInRoom(body.roomId);
	const updatePromises = users
		.filter((user) => user.cardNumber === "not yet")
		.map((user) =>
			planningPokerRepository.updateCardNumberInRoomAndUser(
				user.roomId,
				user.clientId,
				"skip",
			),
		);
	await Promise.all(updatePromises);
};
