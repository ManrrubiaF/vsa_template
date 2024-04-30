import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type UserMenu = {
    option: string;
    islogged: boolean;
    renderSelected: string;
}

const initialState: UserMenu = {
    option: 'Profile',
    islogged: false,
    renderSelected: '',
}

const UserMenuSlice = createSlice({
    name: 'UserMenu',
    initialState,
    reducers: {
        setOption: (state, action: PayloadAction<string>)=>{
            state.option = action.payload;
        },
        setIsLogged: (state, action: PayloadAction<boolean>) =>{
            state.islogged = action.payload
        },
        setRenderComponent: (state, action: PayloadAction<string>) => {
            state.renderSelected = action.payload
        },
        resetUserMenu: (state) => {
            state = initialState;
        }
    }
})

export const { setOption, setIsLogged, resetUserMenu, setRenderComponent } = UserMenuSlice.actions;
export default UserMenuSlice.reducer;