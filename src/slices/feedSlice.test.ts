import { TOrder } from "@utils-types";
import reducer, { fetchFeed, initialState } from "./FeedSlice";


describe('Тестирование слайса feedSlice', () => {
    const makeOrder = (over: Partial<TOrder>): TOrder => ({
        _id: "id",
    status: "pending",
    name: "Заказ",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number: 1,
    ingredients: [],
    ...over,
    });

    it('request', () => {
        const state = reducer(initialState, {type: fetchFeed.pending.type});
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
    });

    it('success', () => {
        const payload = {
            orders: [makeOrder({ number: 101 })],
            total: 50,
        totalToday: 10,
        };
        const state = reducer(initialState, {type: fetchFeed.fulfilled.type, payload});
        expect(state.isLoading).toBe(false);
        expect(state.orders).toEqual(payload.orders);
        expect(state.total).toBe(50);
        expect(state.totalToday).toBe(10);
    });

    it('failed', () => {
        const error = "Ошибка в ленте заказов";
        const state = reducer(initialState, {type: fetchFeed.rejected.type, error: {message: error}});
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(error);
    });

});