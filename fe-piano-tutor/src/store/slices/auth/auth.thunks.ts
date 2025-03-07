// Async thunk for registration
import {createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: { email: string; password: string }, {rejectWithValue}) => {
    try {
      const {email, password} = data
      const payload = {email, password}
      const response = await axios.post('/api/auth/register', payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)
// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string; password: string }, {rejectWithValue}) => {
    try {
      const response = await axios.post('/api/auth/login', data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)
// Async thunk for password reset request
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (data: { email: string }, {rejectWithValue}) => {
    try {
      const response = await axios.post('/api/auth/password-reset/request', data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)
// Async thunk for password reset confirm
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { token: string; newPassword: string }, {rejectWithValue}) => {
    try {
      const response = await axios.post('/api/auth/password-reset/confirm', data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)
