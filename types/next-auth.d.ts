import { DefaultSession, DefaultUser } from 'next-auth';
import { Role, UserStatus } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: Role;
      status: UserStatus;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: Role;
    status: UserStatus;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: Role;
    status: UserStatus;
  }
}
