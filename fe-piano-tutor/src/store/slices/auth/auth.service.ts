import httpService from 'store/httpService'

const authService = {
  register(data: { firstName: string; lastName: string; email: string; password: string }) {
    return httpService.post('/api/auth/register', data);
  },
  login(data: { email: string; password: string }) {
    return httpService.post('/api/auth/login', data);
  },
  updateProfile(data: { firstName: string; lastName: string }) {
    return httpService.put('/api/auth/profile', data);
  },
  requestPasswordReset(data: { email: string }) {
    return httpService.post('/api/auth/password-reset/request', data);
  },
  resetPassword(data: { token: string; newPassword: string }) {
    return httpService.post('/api/auth/password-reset/confirm', data);
  },
};

export default authService;
