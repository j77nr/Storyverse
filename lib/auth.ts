import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { prisma } from '@/lib/prisma';
import { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        // @ts-ignore - Adding custom fields
        session.user.role = token.role;
        // @ts-ignore
        session.user.status = token.status;
        // Mettre à jour l'image depuis le token
        if (token.image) {
          session.user.image = token.image as string;
        }
        // Mettre à jour le nom depuis le token
        if (token.name) {
          session.user.name = token.name as string;
        }
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      // Lors de la première connexion ou mise à jour
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
        // @ts-ignore
        token.status = user.status;
        token.image = user.image;
        token.name = user.name;
      }
      
      // Rafraîchir les données depuis la DB si nécessaire
      if (trigger === 'update' || !token.role) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, status: true, image: true, name: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.image = dbUser.image;
          token.name = dbUser.name;
        }
      }
      
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};
