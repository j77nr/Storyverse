'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PenTool, 
  BookOpen, 
  BarChart3,
  Settings,
  Sparkles,
  Shield
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface NavButton {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  gradient: string;
}

export function AuthorQuickNav() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  const navButtons: NavButton[] = isAdmin ? [
    {
      href: '/admin/dashboard',
      icon: Shield,
      label: 'Dashboard Admin',
      description: 'Panneau d\'administration',
      color: 'from-red-500 to-rose-500',
      gradient: 'hover:shadow-red-500/50',
    },
    {
      href: '/admin/applications',
      icon: Settings,
      label: 'Candidatures',
      description: 'Gérer les candidatures',
      color: 'from-orange-500 to-red-500',
      gradient: 'hover:shadow-orange-500/50',
    },
    {
      href: '/admin/stories',
      icon: BookOpen,
      label: 'Histoires',
      description: 'Gérer les histoires',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'hover:shadow-blue-500/50',
    },
    {
      href: '/library',
      icon: Sparkles,
      label: 'Bibliothèque',
      description: 'Explorer les histoires',
      color: 'from-green-500 to-emerald-500',
      gradient: 'hover:shadow-green-500/50',
    },
  ] : [
    {
      href: '/author/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Gérer vos histoires',
      color: 'from-blue-500 to-cyan-500',
      gradient: 'hover:shadow-blue-500/50',
    },
    {
      href: '/author/submit',
      icon: PenTool,
      label: 'Nouvelle Histoire',
      description: 'Créer une histoire',
      color: 'from-purple-500 to-pink-500',
      gradient: 'hover:shadow-purple-500/50',
    },
    {
      href: '/library',
      icon: BookOpen,
      label: 'Bibliothèque',
      description: 'Explorer les histoires',
      color: 'from-green-500 to-emerald-500',
      gradient: 'hover:shadow-green-500/50',
    },
    {
      href: '/author/analytics',
      icon: BarChart3,
      label: 'Statistiques',
      description: 'Voir vos performances',
      color: 'from-orange-500 to-red-500',
      gradient: 'hover:shadow-orange-500/50',
    },
  ];
  return (
    <div className="relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-3xl blur-3xl" />
      
      <div className="relative rounded-3xl border border-foreground/10 bg-card/50 backdrop-blur-xl p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold text-purple-500">Espace Auteur</span>
          </motion.div>
          <h2 className="text-3xl font-extrabold">Accès Rapide</h2>
          <p className="mt-2 text-foreground/60">Gérez votre contenu en un clic</p>
        </div>

        {/* Navigation Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {navButtons.map((button, index) => (
            <motion.div
              key={button.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link href={button.href}>
                <div
                  className={`
                    group relative overflow-hidden rounded-2xl border border-foreground/10
                    bg-gradient-to-br ${button.color} p-[2px]
                    transition-all duration-300 hover:scale-105 ${button.gradient}
                    hover:shadow-2xl
                  `}
                  style={{
                    transform: 'perspective(1000px) rotateX(0deg)',
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = (y - centerY) / 10;
                    const rotateY = (centerX - x) / 10;
                    e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                  }}
                >
                  {/* Inner Content */}
                  <div className="relative h-full rounded-2xl bg-card p-6 backdrop-blur-xl">
                    {/* Icon */}
                    <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${button.color} p-3 shadow-lg`}>
                      <button.icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Text */}
                    <h3 className="mb-1 text-lg font-bold">{button.label}</h3>
                    <p className="text-sm text-foreground/60">{button.description}</p>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 opacity-0 transition-opacity group-hover:from-white/5 group-hover:to-white/10 group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-xl border border-foreground/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">0</div>
            <div className="text-sm text-foreground/60">Histoires Publiées</div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">0</div>
            <div className="text-sm text-foreground/60">Vues Totales</div>
          </div>
          <div className="rounded-xl border border-foreground/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 text-center">
            <div className="text-2xl font-bold text-green-500">0</div>
            <div className="text-sm text-foreground/60">Lecteurs</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
