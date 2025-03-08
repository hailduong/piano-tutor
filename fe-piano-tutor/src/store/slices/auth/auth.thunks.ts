import {createAsyncThunk} from '@reduxjs/toolkit'
import {AxiosError} from 'axios'
import authService from './auth.service'
import {notification} from 'antd'

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (
    data: { firstName: string; lastName: string; email: string; password: string },
    {rejectWithValue}
  ) => {
    try {
      const response = await authService.register(data)
      return response.data
    } catch (error: AxiosError) {
      notification.error({
        message: error.response?.data.error || 'Failed to register user'
      })
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: { email: string; password: string }, {rejectWithValue}) => {
    try {
      const response = await authService.login(data)
      return response.data
    } catch (error: AxiosError) {
      notification.error({message: error.response?.data.error || 'Failed to login'})
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (data: { firstName: string; lastName: string }, {rejectWithValue}) => {
    try {
      const response = await authService.updateProfile(data)
      notification.success({message: 'Profile updated successfully'})
      return response.data
    } catch (error: AxiosError) {
      notification.error({
        message: error.response?.data.error || 'Failed to update profile'
      })
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (data: { email: string }, {rejectWithValue}) => {
    try {
      const response = await authService.requestPasswordReset(data)
      return response.data
    } catch (error: AxiosError) {
      notification.error(error.response.data.error)
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { token: string; newPassword: string }, {rejectWithValue}) => {
    try {
      const response = await authService.resetPassword(data)
      return response.data
    } catch (error: AxiosError) {
      notification.error(error.response.data.error)
      return rejectWithValue(error.response ? error.response.data : error.message)
    }
  }
)
