import { useSession } from 'next-auth/react';

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isAuthor: session?.user?.role === 'AUTHOR' || session?.user?.role === 'ADMIN',
    isModerator: session?.user?.role === 'MODERATOR' || session?.user?.role === 'ADMIN',
    isAdmin: session?.user?.role === 'ADMIN',
  };
}
