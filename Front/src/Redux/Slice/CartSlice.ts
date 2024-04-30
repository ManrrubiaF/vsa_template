import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Cart = {
    productId: number ;
    color: string;
    stock: number;
    size: string;

}

const initialState = {
    Cart: {
        productId: 0,
        color: "",
        stock: 0,
        size: "",
    }
} 

const cartSlice = createSlice({
    name: 'CartStatus',
    initialState,
    reducers: {
        setCart: (state, action: PayloadAction<Partial<Cart>>) => {
            state.Cart = { ...state.Cart, ...action.payload };
        },
        
        resetCart: (state) => {
            state.Cart = initialState.Cart; 
        },
    }
})

export const { setCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;