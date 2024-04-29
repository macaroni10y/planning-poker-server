export interface RoomActionParamsBase {
    roomId: string
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
    type: "revealAllCards"
}

export interface ResetRoomParams extends RoomActionParamsBase {
    type: "resetRoom"
}

export type ActionParams = JoinRoomParams | SubmitCardParams | RevealAllCardsParams | ResetRoomParams;
