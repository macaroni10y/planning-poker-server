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

export interface ResetTimerParms extends RoomActionParamsBase {
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

export type ActionParams =
	| JoinRoomParams
	| SubmitCardParams
	| RevealAllCardsParams
	| ResetRoomParams
	| ResetTimerParms
	| PauseTimerParams
	| ResumeTimerParams;
