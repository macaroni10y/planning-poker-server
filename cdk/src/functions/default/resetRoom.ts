import {planningPokerRepository} from "../../repository/PlanningPokerRepository";
import {ResetRoomParams} from "../../types/actionParams";

export const resetRoom = async (body: ResetRoomParams) => await planningPokerRepository.updateAllCardNumberInRoom(body.roomId, "not yet")
