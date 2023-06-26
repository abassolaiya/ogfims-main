import { createSlice } from '@reduxjs/toolkit';

let isLogin = localStorage.getItem('ogfimsAdmin');
isLogin = JSON.parse(isLogin);

const initialState = {
  isLogin: isLogin ? true : false,
  currentUser: isLogin ? isLogin : {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload.user;
      state.isLogin = action.payload.login;
    },
  },
});

export const { setCurrentUser } = authSlice.actions;
const authReducer = authSlice.reducer;

export default authReducer;
