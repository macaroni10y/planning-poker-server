import {planningPokerRepository} from "../../repository/PlanningPokerRepository";

export const submitCard = async (body: any, clientId: string) => await planningPokerRepository.updateCardNumberInRoomAndUser(body.roomId, clientId, body.cardNumber)
