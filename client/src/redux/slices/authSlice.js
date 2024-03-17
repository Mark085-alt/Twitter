import {
    createSlice,
    createAsyncThunk
} from '@reduxjs/toolkit';

import {
    login,
    logout,
    verifyToken,
    getUserData
} from "../../services/authService.js";



// verify token
export const authVerifyToken = createAsyncThunk(
    "auth/verify-token",
    async (thunkAPI) => {
        try {
            const res = await verifyToken();
            return res.data;

        } catch (error) {
            if (error.response) {
                return thunkAPI.rejectWithValue(error.response.data);
            } else {
                // Handle other types of errors (e.g., network error)
                return thunkAPI.rejectWithValue({ message: error.message });
            }
        }
    }
);

//  Get user data
export const authGetUserData = createAsyncThunk(
    "auth/getUserData",
    async (thunkAPI) => {
        try {
            const res = await getUserData();
            return res.data;

        } catch (error) {
            if (error.response) {
                return thunkAPI.rejectWithValue(error.response.data);
            } else {
                // Handle other types of errors (e.g., network error)
                return thunkAPI.rejectWithValue({ message: error.message });
            }
        }
    }
);


// login
export const authLogin = createAsyncThunk(
    "auth/login",
    async (data, thunkAPI) => {
        try {
            const res = await login(data)
            return res.data;
        } catch (error) {
            if (error.response) {
                return thunkAPI.rejectWithValue(error.response.data);
            } else {
                // Handle other types of errors (e.g., network error)
                return thunkAPI.rejectWithValue({ message: error.message });
            }
        }
    }
);


// logout
export const authLogout = createAsyncThunk(
    "auth/logout",
    async (data) => {
        const res = await logout(data);
        return res;
    }
);


// Initial State of slice
const initialState = {
    isLoading: false,
    user: null,
    isError: null,
};


const authSlice = createSlice({

    name: "auth",
    initialState,
    extraReducers: (builder) => {

        // login
        builder.addCase(authLogin.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(authLogin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = null;
            state.user = action.payload?.data?.loggedInUser;
        });

        builder.addCase(authLogin.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        })


        // Verify Token
        builder.addCase(authVerifyToken.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(authVerifyToken.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isError = null;
            state.user = action.payload?.data;
        });

        builder.addCase(authVerifyToken.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = action.payload;
        });


        // get user data
        builder.addCase(authGetUserData.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(authGetUserData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.data;
        });

        builder.addCase(authGetUserData.rejected, (state) => {
            state.isError = true;
        });



        // logout
        builder.addCase(authLogout.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(authLogout.fulfilled, (state) => {
            state.isLoading = false;
            state.user = null;
        });

        builder.addCase(authLogout.rejected, (state) => {
            state.isError = true;
        })
    }
});



export default authSlice.reducer;