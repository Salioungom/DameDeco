// Script TypeScript pour nettoyer les cookies et localStorage
// Exécuter dans la console du navigateur (F12)

export function clearAuthData(): void {
  if (typeof window !== 'undefined') {
    // Supprimer tous les cookies liés à l'authentification
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Supprimer aussi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_fullname');
    localStorage.removeItem('user_email');
    
    console.log('✅ Cookies et localStorage nettoyés');
  }
}

// Fonction pour vérifier l'état actuel
export function checkAuthState(): void {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userFullname = localStorage.getItem('user_fullname');
    const userEmail = localStorage.getItem('user_email');
    
    console.log('🔍 État actuel:');
    console.log('- Token localStorage:', token ? '✅ Présent' : '❌ Absent');
    console.log('- Refresh token localStorage:', refreshToken ? '✅ Présent' : '❌ Absent');
    console.log('- User fullname:', userFullname || '❌ Non défini');
    console.log('- User email:', userEmail || '❌ Non défini');
    console.log('- Cookies:', document.cookie);
  }
}

// Export par défaut
export default {
  clearAuthData,
  checkAuthState
};
