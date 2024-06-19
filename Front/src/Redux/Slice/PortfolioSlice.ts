import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Portfolio = {
    id: number;
    description: string;
    links: string[]
}

const initialState: Portfolio[] = [];

const portfolioSlice = createSlice({
    name: 'Portfolio',
    initialState,
    reducers: {
        setPortfolio: (state, action: PayloadAction<Portfolio[]>) =>{
            return action.payload;
        },
    }
})

export const { setPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;