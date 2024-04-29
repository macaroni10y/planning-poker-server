import { planningPokerRepository } from "../../repository/PlanningPokerRepository";
import type { SubmitCardParams } from "../../types/actionParams";

export const submitCard = async (body: SubmitCardParams) =>
	await planningPokerRepository.updateCardNumberInRoomAndUser(
		body.roomId,
		body.clientId,
		body.cardNumber,
	);
