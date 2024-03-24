import {planningPokerRepository} from "../../repository/PlanningPokerRepository";

export const resetRoom = async (body: any) => await planningPokerRepository.updateAllCardNumberInRoom(body.roomId, "not yet")
