'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LogIn, LogOut, User, Shield } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps {
  logoText?: string;
  navLinks?: { label: string; href: string }[];
}

export function Header({ 
  logoText = 'StoryVerse',
  navLinks = [
    { label: 'ACCUEIL', href: '/' },
    { label: 'BIBLIOTHÈQUE', href: '/library' },
    { label: 'AUTEURS', href: '/authors' },
    { label: 'À PROPOS', href: '/about' },
  ]
}: HeaderProps) {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <header className="relative z-50 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-8 md:p-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="text-xl font-bold tracking-wider">
            {logoText}
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium tracking-widest text-foreground/60 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Button */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <ThemeToggle />
          {status === 'loading' ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-foreground/10" />
          ) : status === 'authenticated' && session?.user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 rounded-full border border-foreground/20 bg-card px-4 py-2 transition-all hover:border-foreground/40 hover:shadow-lg"
              >
                <img
                  src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`}
                  alt={session.user.name || 'User'}
                  className="h-6 w-6 rounded-full"
                />
                <span className="hidden text-sm font-medium md:block">
                  {session.user.name}
                </span>
                {session.user.role === 'ADMIN' && (
                  <Shield className="h-4 w-4 text-red-500" />
                )}
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 z-[60] mt-2 w-56 rounded-xl border bg-card shadow-xl"
                >
                  <div className="p-4 border-b">
                    <p className="font-semibold">{session.user.name}</p>
                    <p className="text-sm text-foreground/60">{session.user.email}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`
                        inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold
                        ${session.user.role === 'ADMIN' && 'bg-red-500/10 text-red-500'}
                        ${session.user.role === 'AUTHOR' && 'bg-purple-500/10 text-purple-500'}
                        ${session.user.role === 'VISITOR' && 'bg-gray-500/10 text-gray-500'}
                      `}>
                        {session.user.role === 'ADMIN' && <Shield className="h-3 w-3" />}
                        {session.user.role}
                      </span>
                    </div>
                  </div>

                  <div className="p-2">
                    {session.user.role === 'ADMIN' && (
                      <>
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-foreground/5"
                          onClick={() => setShowMenu(false)}
                        >
                          <Shield className="h-4 w-4" />
                          Dashboard Admin
                        </Link>
                        <Link
                          href="/admin/applications"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-foreground/5"
                          onClick={() => setShowMenu(false)}
                        >
                          <Shield className="h-4 w-4" />
                          Candidatures
                        </Link>
                      </>
                    )}
                    
                    {session.user.role === 'AUTHOR' && (
                      <>
                        <Link
                          href="/author/dashboard"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-foreground/5"
                          onClick={() => setShowMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Dashboard Auteur
                        </Link>
                        <Link
                          href="/author/profile"
                          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-foreground/5"
                          onClick={() => setShowMenu(false)}
                        >
                          <User className="h-4 w-4" />
                          Mon Profil
                        </Link>
                      </>
                    )}

                    {session.user.role === 'VISITOR' && (
                      <Link
                        href="/become-author"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-foreground/5"
                        onClick={() => setShowMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Devenir Auteur
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        signOut();
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Se Déconnecter
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:shadow-lg"
            >
              <LogIn className="h-4 w-4" />
              Se Connecter
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="flex flex-col space-y-1.5 md:hidden"
            aria-label="Open menu"
            onClick={() => setShowMenu(!showMenu)}
          >
            <span className="block h-0.5 w-6 bg-foreground"></span>
            <span className="block h-0.5 w-6 bg-foreground"></span>
            <span className="block h-0.5 w-5 bg-foreground"></span>
          </button>
        </motion.div>
      </div>

      {/* Click outside to close */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </header>
  );
}
