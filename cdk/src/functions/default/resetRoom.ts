import { planningPokerRepository } from "../../repository/PlanningPokerRepository";
import type { ResetRoomParams } from "../../types/actionParams";

export const resetRoom = async (body: ResetRoomParams) =>
	await planningPokerRepository.updateAllCardNumberInRoom(
		body.roomId,
		"not yet",
	);
