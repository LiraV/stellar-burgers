import { TOrder } from "@utils-types";
import reducer, { fetchProfileOrders, initialState } from "./ProfileOrdersSlice";


describe('Тестирование слайса profileOrdersSlice', () => {
    const mockOrders = [
      {
        _id: '1',
        name: 'Тестовый заказ',
        status: 'done',
        number: 1,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        ingredients: ['1', '2']
      },
      {
        _id: '2',
        name: 'Ещё заказ',
        status: 'pending',
        number: 2,
        createdAt: '2025-01-02T00:00:00.000Z',
        updatedAt: '2025-01-02T00:00:00.000Z',
        ingredients: ['2', '3']
      }
    ];
    it('request', () => {
        const state = reducer(initialState, {type: fetchProfileOrders.pending.type});
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('success', () => {
        const state = reducer(initialState, {type: fetchProfileOrders.fulfilled.type, payload: mockOrders});
        expect(state.isLoading).toBe(false);
        expect(state.orders).toEqual(mockOrders);
    });

    it('failed', () => {
        const error = 'Ошибка заказов профиля';
        const state = reducer(initialState, {type: fetchProfileOrders.rejected.type, error: {message: error}});
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(error);
    });
});