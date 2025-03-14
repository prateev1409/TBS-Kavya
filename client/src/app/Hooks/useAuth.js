export function useAuth() {
  const signOut = () => {
    localStorage.removeItem('token');
    window.location.href = '/auth/signin';
  };

  return { signOut };
}