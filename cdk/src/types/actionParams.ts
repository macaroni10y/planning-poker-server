export interface RoomActionParamsBase {
    roomId: string;
    clientId: string;
}

export interface JoinRoomParams extends RoomActionParamsBase {
    type: "joinRoom";
    userName: string;
}

export interface SubmitCardParams extends RoomActionParamsBase {
    type: "submitCard";
    cardNumber: string;
}

export interface RevealAllCardsParams extends RoomActionParamsBase {
    type: "revealAllCards";
}

export interface ResetRoomParams extends RoomActionParamsBase {
    type: "resetRoom";
}

export interface ResetTimerParams extends RoomActionParamsBase {
    type: "resetTimer";
}

export interface PauseTimerParams extends RoomActionParamsBase {
    type: "pauseTimer";
    time: number;
}

export interface ResumeTimerParams extends RoomActionParamsBase {
    type: "resumeTimer";
    time: number;
}

export interface ReactionParams extends RoomActionParamsBase {
    type: "reaction";
    /**
     *  kind of reaction. no strict definition on backend
     *  @example "laugh", "like"...
     */
    kind: string;
    spread: boolean;
}

export type ActionParams =
    | JoinRoomParams
    | SubmitCardParams
    | RevealAllCardsParams
    | ResetRoomParams
    | ResetTimerParams
    | PauseTimerParams
    | ResumeTimerParams
    | ReactionParams;
