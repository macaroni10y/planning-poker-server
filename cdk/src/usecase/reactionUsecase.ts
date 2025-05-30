import { notificationService } from "../service/NotificationService";
import type { ReactionParams } from "../types/actionParams";

export const reactionUsecase = async (body: ReactionParams) => {
    await notificationService.notifyReaction({
        kind: body.kind,
        roomId: body.roomId,
        clientId: body.clientId,
    });
};
