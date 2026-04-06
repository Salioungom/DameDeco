// Script de debug pour l'authentification
console.log('=== DEBUG AUTHENTICATION ===');

// Vérifier localStorage
if (typeof window !== 'undefined') {
  const accessToken = localStorage.getItem('accessToken');
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  
  console.log('Tokens stockés:');
  console.log('accessToken:', accessToken ? 'PRÉSENT' : 'ABSENT');
  console.log('token:', token ? 'PRÉSENT' : 'ABSENT');
  console.log('refreshToken:', refreshToken ? 'PRÉSENT' : 'ABSENT');
  
  if (accessToken) {
    try {
      // Décoder le token JWT (si c'est un JWT)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log('Token payload:', payload);
      console.log('Token expiré?', Date.now() > payload.exp * 1000);
    } catch (e) {
      console.log('Token non-JWT ou invalide');
    }
  }
} else {
  console.log('Window non disponible');
}

console.log('=== FIN DEBUG ===');
