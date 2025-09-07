import { TIngredient } from "@utils-types";
import reducer, { addIngredient, moveIngredient, removeIngredientById } from "./ConstructorSlice";


jest.mock('uuid', () => ({ v4: jest.fn()}));
import * as uuid from 'uuid';

describe('Тестирование Reducer слайса ConstructorSlice', () => {
    const baseState = {
        bun: null,
        ingredients: [],
        counter: 0,
        orderRequest: false,
        orderModalData: null,
        error: null
    };
    
    const ingredient1: TIngredient = {
        
      _id: '1',
      name: "Флюоресцентная булка R2-D3",
      type: "bun",
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: "https://code.s3.yandex.net/react/code/bun-01.png",
      image_mobile: "https://code.s3.yandex.net/react/code/bun-01-mobile.png",
      image_large: "https://code.s3.yandex.net/react/code/bun-01-large.png"
    };

    const ingredient2: TIngredient = {
      "_id": "2",
      "name": "Филе Люминесцентного тетраодонтиформа",
      "type": "main",
      "proteins": 44,
      "fat": 26,
      "carbohydrates": 85,
      "calories": 643,
      "price": 988,
      "image": "https://code.s3.yandex.net/react/code/meat-01.png",
      "image_mobile": "https://code.s3.yandex.net/react/code/meat-01-mobile.png",
      "image_large": "https://code.s3.yandex.net/react/code/meat-01-large.png"
    };

    const ingredient3: TIngredient = {
      "_id": "3",
      "name": "Соус Spicy-X",
      "type": "sauce",
      "proteins": 30,
      "fat": 20,
      "carbohydrates": 40,
      "calories": 300,
      "price": 90,
      "image": "https://code.s3.yandex.net/react/code/sauce-02.png",
      "image_mobile": "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
      "image_large": "https://code.s3.yandex.net/react/code/sauce-02-large.png"
    };

    beforeEach(() => {
        (uuid.v4 as jest.Mock).mockReset();
    });

    it('обработка экшена добавления ингредиента', () => {
        (uuid.v4 as jest.Mock).mockReturnValueOnce('id-1');
        const state = reducer(baseState, addIngredient(ingredient1));
        expect(state.ingredients).toHaveLength(1);
        expect(state.ingredients[0]).toEqual({
            ...ingredient1,
            id: 'id-1'
        });
    }); 

    it('обработка экшена удаления ингредиента', () => {
        (uuid.v4 as jest.Mock).mockReturnValueOnce('id-2');
        let state = reducer(baseState, addIngredient(ingredient2));
        state = reducer(state, removeIngredientById('id-2'));
        expect(state.ingredients).toHaveLength(0);
    });

    it('обработку экшена изменения порядка ингредиентов в начинке', () => {
        (uuid.v4 as jest.Mock)
            .mockReturnValueOnce('id-2')
            .mockReturnValueOnce('id-3');
            let state = reducer(baseState, addIngredient(ingredient2));
            state = reducer(state, addIngredient(ingredient3));
            state = reducer(state, moveIngredient({from: 0, to: 1}));
            expect(state.ingredients.map(i => i.id)).toEqual(['id-3', 'id-2']);

    })
});