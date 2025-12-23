import { AuthService } from '../../services/authService.js';

export const AppEngine = {
  init() {
    const user = AuthService.GetCurrentUser();
    if (!user) {
      console.warn('Usuário não autenticado. Redirecionando...');
      window.location.href = '/mockPAEFI/';
      return false;
    }
    return true;
  },

  GetCurrentUser() {
    return AuthService.GetCurrentUser();
  }
};
