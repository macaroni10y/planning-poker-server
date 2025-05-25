import { notificationService } from "../service/NotificationService";
import { ReactionParams } from "../types/actionParams";

export const reactionUsecase = async (body: ReactionParams) => {
    await notificationService.notifyReaction(
				body.kind,
				body.roomId,
				body.clientId,
			);
}
