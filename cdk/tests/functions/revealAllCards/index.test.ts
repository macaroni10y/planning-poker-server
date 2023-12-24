import {planningPokerRepository} from "../../../src/repository/PlanningPokerRepository";
import {revealAllCards} from "../../../src/functions/revealAllCards";

describe('revealAllCards', () => {
    let findUsersInRoomSpy: jest.SpyInstance;
    let updateCardNumberInRoomAndUserSpy: jest.SpyInstance;

    beforeEach(() => {
        findUsersInRoomSpy = jest.spyOn(planningPokerRepository, 'findUsersInRoom');
        updateCardNumberInRoomAndUserSpy = jest.spyOn(planningPokerRepository, 'updateCardNumberInRoomAndUser');
    });

    afterEach(() => {
        findUsersInRoomSpy.mockRestore();
        updateCardNumberInRoomAndUserSpy.mockRestore();
    });

    it('should reveal all cards successfully', async () => {
        // given
        const body = {
            roomId: '__room_id__',
        };
        findUsersInRoomSpy.mockResolvedValue([
            {
                clientId: '__client_id_1__',
                roomId: '__room_id__',
                name: '__user_name_1__',
                cardNumber: null,
            },
            {
                clientId: '__client_id_2__',
                roomId: '__room_id__',
                name: '__user_name_2__',
                cardNumber: '1',
            }
        ]);
        updateCardNumberInRoomAndUserSpy.mockResolvedValue(undefined);

        // when
        await revealAllCards(body);

        // then
        expect(findUsersInRoomSpy).toHaveBeenCalledWith('__room_id__');
        expect(updateCardNumberInRoomAndUserSpy).toBeCalledTimes(1);
        expect(updateCardNumberInRoomAndUserSpy).toHaveBeenCalledWith('__room_id__', '__client_id_1__', 'skip');
    });

    it('should not reveal cards when all users have already voted', async () => {
        // given
        const body = {
            roomId: '__room_id__',
        };
        findUsersInRoomSpy.mockResolvedValue([
            {
                clientId: '__client_id_1__',
                roomId: '__room_id__',
                name: '__user_name_1__',
                cardNumber: '1',
            },
            {
                clientId: '__client_id_2__',
                roomId: '__room_id__',
                name: '__user_name_2__',
                cardNumber: '2',
            }
        ]);
        updateCardNumberInRoomAndUserSpy.mockResolvedValue(undefined);

        // when
        await revealAllCards(body);

        // then
        expect(findUsersInRoomSpy).toHaveBeenCalledWith('__room_id__');
        expect(updateCardNumberInRoomAndUserSpy).toBeCalledTimes(0);
    });
});
