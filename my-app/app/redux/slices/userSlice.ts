import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  interests: string[];
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  interests: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
    setInterests: (state, action: PayloadAction<string[]>) => {
      state.interests = action.payload;
    },
  },
});

export const { setUser, clearUser, setInterests } = userSlice.actions;
export default userSlice.reducer;