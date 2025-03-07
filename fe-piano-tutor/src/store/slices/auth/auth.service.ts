import httpService from 'store/httpService'

const authService = {
  register(data: { email: string; password: string }) {
    return httpService.post('/api/auth/register', data);
  },
  login(data: { email: string; password: string }) {
    return httpService.post('/api/auth/login', data);
  },
  requestPasswordReset(data: { email: string }) {
    return httpService.post('/api/auth/password-reset/request', data);
  },
  resetPassword(data: { token: string; newPassword: string }) {
    return httpService.post('/api/auth/password-reset/confirm', data);
  },
};

export default authService;
