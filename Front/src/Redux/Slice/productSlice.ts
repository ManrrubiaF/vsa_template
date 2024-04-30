import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Product = {
    id: number;
    name:string
    price: string;
    description: string;
    category:string;
    active: boolean;
    details: Detail[];
};

type Detail = {
    color: string | null;
    stock: number;
    image: string[];
    size: string[],
}

const initialState: Product[] = []

const productSlice = createSlice({
    name: 'Products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            return action.payload;
        },
        resetProducts: (state) => {
            state = initialState;
        },
    }
});

export const { setProducts, resetProducts } = productSlice.actions;
export default productSlice.reducer;