import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log('=== API Stats Called ===');

    // Test sans vérification de session pour déboguer
    console.log('Fetching users...');
    const allUsers = await prisma.user.findMany({
      select: { role: true },
    });
    console.log('Users fetched:', allUsers.length);

    console.log('Fetching stories...');
    const allStories = await prisma.story.findMany({
      select: { 
        status: true,
        stats: {
          select: {
            views: true,
            likes: true,
          }
        }
      },
    });
    console.log('Stories fetched:', allStories.length);

    console.log('Fetching applications...');
    const allApplications = await prisma.authorApplication.findMany({
      select: { status: true },
    });
    console.log('Applications fetched:', allApplications.length);

    const roleStats = {
      total: allUsers.length,
      authors: allUsers.filter(u => u.role === 'AUTHOR').length,
      visitors: allUsers.filter(u => u.role === 'VISITOR').length,
      admins: allUsers.filter(u => u.role === 'ADMIN').length,
    };

    const storyStats = {
      total: allStories.length,
      published: allStories.filter(s => s.status === 'PUBLISHED').length,
      pending: allStories.filter(s => s.status === 'PENDING').length,
      rejected: allStories.filter(s => s.status === 'REJECTED').length,
    };

    const applicationStats = {
      total: allApplications.length,
      pending: allApplications.filter(a => a.status === 'PENDING').length,
      approved: allApplications.filter(a => a.status === 'APPROVED').length,
      rejected: allApplications.filter(a => a.status === 'REJECTED').length,
    };

    const engagement = {
      totalViews: allStories.reduce((sum, s) => sum + (s.stats?.views || 0), 0),
      totalLikes: allStories.reduce((sum, s) => sum + (s.stats?.likes || 0), 0),
    };

    console.log('Returning stats:', roleStats);

    return NextResponse.json({
      users: roleStats,
      stories: storyStats,
      applications: applicationStats,
      engagement,
      recentActivity: [],
    });
  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Error name:', error?.constructor?.name);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur serveur', 
        details: error instanceof Error ? error.message : String(error),
        name: error?.constructor?.name
      },
      { status: 500 }
    );
  }
}
