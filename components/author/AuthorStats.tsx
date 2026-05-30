'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Eye, Heart, TrendingUp } from 'lucide-react';

interface Stats {
  publishedStories: number;
  totalViews: number;
  totalLikes: number;
  pendingStories: number;
}

export function AuthorStats() {
  const [stats, setStats] = useState<Stats>({
    publishedStories: 0,
    totalViews: 0,
    totalLikes: 0,
    pendingStories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/stories/author');
        const data = await response.json();
        
        if (response.ok && data.stories) {
          const published = data.stories.filter((s: any) => s.status === 'PUBLISHED').length;
          const pending = data.stories.filter((s: any) => s.status === 'PENDING').length;
          const views = data.stories.reduce((acc: number, s: any) => acc + (s.stats?.views || 0), 0);
          const likes = data.stories.reduce((acc: number, s: any) => acc + (s.stats?.likes || 0), 0);
          
          setStats({
            publishedStories: published,
            totalViews: views,
            totalLikes: likes,
            pendingStories: pending,
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Histoires Publiées',
      value: stats.publishedStories,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      label: 'Vues Totales',
      value: stats.totalViews,
      icon: Eye,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-500/10 to-pink-500/10',
    },
    {
      label: 'Likes',
      value: stats.totalLikes,
      icon: Heart,
      color: 'from-red-500 to-rose-500',
      bgColor: 'from-red-500/10 to-rose-500/10',
    },
    {
      label: 'En Révision',
      value: stats.pendingStories,
      icon: TrendingUp,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'from-orange-500/10 to-yellow-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-foreground/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
          className={`
            group relative overflow-hidden rounded-xl border border-foreground/10
            bg-gradient-to-br ${stat.bgColor} p-6
            transition-all duration-300 hover:scale-105 hover:shadow-xl
          `}
        >
          {/* Icon */}
          <div className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${stat.color} p-2.5 shadow-lg`}>
            <stat.icon className="h-5 w-5 text-white" />
          </div>

          {/* Value */}
          <div className={`mb-1 text-3xl font-extrabold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
            {stat.value}
          </div>

          {/* Label */}
          <div className="text-sm font-medium text-foreground/60">{stat.label}</div>

          {/* Hover Glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/0 to-white/0 opacity-0 transition-opacity group-hover:from-white/5 group-hover:to-white/10 group-hover:opacity-100" />
        </motion.div>
      ))}
    </div>
  );
}
