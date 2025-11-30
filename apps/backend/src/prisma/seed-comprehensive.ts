import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

/**
 * Comprehensive seed script for VidScoreAI
 * Populates database with realistic video analysis data based on research
 * from video analytics and performance measurement best practices
 */

export async function seedComprehensiveData(prisma: PrismaClient): Promise<void> {
  console.log('🌱 Starting comprehensive data seeding for VidScoreAI...');

  // Seed videos with various types and statuses
  await seedVideos(prisma);

  console.log('✅ Comprehensive seeding completed!');
}

async function seedVideos(prisma: PrismaClient) {
  const videoTypes = [
    {
      category: 'Product Demo',
      examples: [
        { name: 'Product Launch Video - Q4 2024', duration: 180 },
        { name: 'Feature Showcase - AI Integration', duration: 120 },
        { name: 'Mobile App Walkthrough', duration: 90 },
      ],
    },
    {
      category: 'Marketing',
      examples: [
        { name: 'Brand Story - Company Mission', duration: 240 },
        { name: 'Customer Testimonial Compilation', duration: 150 },
        { name: 'Holiday Campaign Video', duration: 60 },
        { name: 'Social Media Ad - Instagram', duration: 30 },
      ],
    },
    {
      category: 'Educational',
      examples: [
        { name: 'How-to Tutorial - Getting Started', duration: 600 },
        { name: 'Webinar Recording - Best Practices', duration: 3600 },
        { name: 'Quick Tips Series - Episode 1', duration: 180 },
      ],
    },
    {
      category: 'Sales',
      examples: [
        { name: 'Sales Pitch - Enterprise Solution', duration: 300 },
        { name: 'Personalized Outreach Video', duration: 45 },
        { name: 'Follow-up Video - Product Demo', duration: 120 },
      ],
    },
    {
      category: 'Support',
      examples: [
        { name: 'Troubleshooting Guide - Common Issues', duration: 420 },
        { name: 'FAQ Video - Account Setup', duration: 180 },
      ],
    },
  ];

  const statuses: Array<'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'> = [
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'COMPLETED',
    'COMPLETED',
    'COMPLETED',
    'COMPLETED',
    'COMPLETED',
    'COMPLETED',
    'COMPLETED',
    'FAILED',
  ];

  const mimeTypes = [
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
  ];

  let videoCount = 0;

  for (const type of videoTypes) {
    for (const example of type.examples) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const size = Math.floor(Math.random() * 50000000) + 1000000; // 1MB to 50MB
      const mimeType = mimeTypes[Math.floor(Math.random() * mimeTypes.length)];
      const filename = `${randomUUID()}.${mimeType.split('/')[1]}`;
      
      // Create video
      const video = await prisma.video.create({
        data: {
          filename,
          originalName: `${example.name}.${mimeType.split('/')[1]}`,
          url: `https://stmahumsharedapps.blob.core.windows.net/vidscoreai/${filename}`,
          mimeType,
          size,
          status,
        },
      });

      // Create analysis if video is completed
      if (status === 'COMPLETED') {
        const analysis = generateRealisticAnalysis(example.name, type.category, example.duration);
        await prisma.analysis.create({
          data: {
            videoId: video.id,
            overallScore: analysis.overallScore,
            summary: analysis.summary,
            details: analysis.details,
          },
        });
      }

      videoCount++;
    }
  }

  // Add some additional videos with different characteristics
  const additionalVideos = [
    {
      name: 'High-Performing Marketing Video',
      category: 'Marketing',
      duration: 90,
      expectedScore: 92,
    },
    {
      name: 'Low Engagement Tutorial',
      category: 'Educational',
      duration: 1200,
      expectedScore: 65,
    },
    {
      name: 'Viral Social Media Clip',
      category: 'Marketing',
      duration: 15,
      expectedScore: 88,
    },
    {
      name: 'Technical Deep Dive',
      category: 'Educational',
      duration: 1800,
      expectedScore: 75,
    },
    {
      name: 'Product Comparison Video',
      category: 'Product Demo',
      duration: 300,
      expectedScore: 85,
    },
  ];

  for (const videoData of additionalVideos) {
    const filename = `${randomUUID()}.mp4`;
    const video = await prisma.video.create({
      data: {
        filename,
        originalName: `${videoData.name}.mp4`,
        url: `https://stmahumsharedapps.blob.core.windows.net/vidscoreai/${filename}`,
        mimeType: 'video/mp4',
        size: Math.floor(Math.random() * 30000000) + 5000000,
        status: 'COMPLETED',
      },
    });

    const analysis = generateRealisticAnalysis(
      videoData.name,
      videoData.category,
      videoData.duration,
      videoData.expectedScore
    );

    await prisma.analysis.create({
      data: {
        videoId: video.id,
        overallScore: analysis.overallScore,
        summary: analysis.summary,
        details: analysis.details,
      },
    });

    videoCount++;
  }

  console.log(`✓ Seeded ${videoCount} videos with analyses`);
}

function generateRealisticAnalysis(
  videoName: string,
  category: string,
  duration: number,
  targetScore?: number
): {
  overallScore: number;
  summary: string;
  details: any;
} {
  // Generate scores based on category and duration best practices
  let baseScore = targetScore || 80;

  // Adjust base score based on category performance expectations
  const categoryAdjustments: Record<string, number> = {
    'Marketing': 5,
    'Product Demo': 3,
    'Sales': 2,
    'Educational': -2,
    'Support': 0,
  };

  baseScore += categoryAdjustments[category] || 0;

  // Adjust for optimal duration (shorter videos often perform better)
  if (duration < 60) {
    baseScore += 3; // Short videos are engaging
  } else if (duration > 600) {
    baseScore -= 5; // Very long videos have lower completion rates
  }

  // Add some variance
  const variance = Math.floor(Math.random() * 15) - 7;
  const overallScore = Math.max(50, Math.min(100, baseScore + variance));

  // Generate individual metric scores
  const hookScore = overallScore + Math.floor(Math.random() * 10) - 5;
  const pacingScore = overallScore + Math.floor(Math.random() * 12) - 6;
  const visualsScore = overallScore + Math.floor(Math.random() * 8) - 4;
  const ctaScore = overallScore + Math.floor(Math.random() * 10) - 5;
  const engagementScore = overallScore + Math.floor(Math.random() * 10) - 5;
  const retentionScore = overallScore + Math.floor(Math.random() * 12) - 6;

  // Generate feedback based on scores
  const feedbacks = {
    hook: generateHookFeedback(hookScore, duration),
    pacing: generatePacingFeedback(pacingScore, duration),
    visuals: generateVisualsFeedback(visualsScore),
    cta: generateCTAFeedback(ctaScore),
    engagement: generateEngagementFeedback(engagementScore),
    retention: generateRetentionFeedback(retentionScore, duration),
  };

  // Generate summary
  const summary = generateSummary(videoName, category, overallScore, feedbacks);

  return {
    overallScore,
    summary,
    details: {
      hook: {
        score: Math.max(50, Math.min(100, hookScore)),
        feedback: feedbacks.hook,
        strength: hookScore >= 85 ? 'Strong' : hookScore >= 70 ? 'Moderate' : 'Weak',
      },
      pacing: {
        score: Math.max(50, Math.min(100, pacingScore)),
        feedback: feedbacks.pacing,
        optimalDuration: getOptimalDuration(category),
      },
      visuals: {
        score: Math.max(50, Math.min(100, visualsScore)),
        feedback: feedbacks.visuals,
        quality: visualsScore >= 85 ? 'High' : visualsScore >= 70 ? 'Good' : 'Needs Improvement',
      },
      cta: {
        score: Math.max(50, Math.min(100, ctaScore)),
        feedback: feedbacks.cta,
        clarity: ctaScore >= 80 ? 'Clear' : 'Unclear',
      },
      engagement: {
        score: Math.max(50, Math.min(100, engagementScore)),
        feedback: feedbacks.engagement,
        expectedRate: `${Math.floor(engagementScore / 10)}%`,
      },
      retention: {
        score: Math.max(50, Math.min(100, retentionScore)),
        feedback: feedbacks.retention,
        completionRate: `${Math.floor(retentionScore / 2)}%`,
      },
      metrics: {
        watchTime: Math.floor(duration * 0.6), // 60% average watch time
        averageViewDuration: Math.floor(duration * (retentionScore / 100)),
        clickThroughRate: `${(ctaScore / 10).toFixed(1)}%`,
        engagementRate: `${(engagementScore / 10).toFixed(1)}%`,
      },
      recommendations: generateRecommendations(overallScore, feedbacks),
    },
  };
}

function generateHookFeedback(score: number, duration: number): string {
  if (score >= 85) {
    return `Excellent hook! The first ${Math.min(3, duration / 20)} seconds are highly engaging and immediately capture attention. Strong opening that sets clear expectations.`;
  } else if (score >= 70) {
    return `Good hook, but could be stronger. Consider starting with a compelling question or visual that immediately draws viewers in. The first few seconds are critical for retention.`;
  } else {
    return `Weak opening. The hook doesn't immediately engage viewers. Consider starting with a bold statement, surprising fact, or visual that creates curiosity. First 3 seconds are crucial.`;
  }
}

function generatePacingFeedback(score: number, duration: number): string {
  const optimalDuration = duration < 60 ? 'excellent' : duration < 180 ? 'good' : duration < 600 ? 'moderate' : 'could be shorter';
  
  if (score >= 85) {
    return `Pacing is ${optimalDuration} for this content type. The video maintains viewer interest throughout with well-timed transitions and no unnecessary pauses.`;
  } else if (score >= 70) {
    return `Pacing is generally good, but there are moments where the video slows down. Consider tightening mid-video segments and removing filler content to improve retention.`;
  } else {
    return `Pacing needs improvement. The video has slow sections that may cause viewers to drop off. Consider faster cuts, removing redundant information, or breaking into shorter segments.`;
  }
}

function generateVisualsFeedback(score: number): string {
  if (score >= 85) {
    return `High-quality production with excellent visual composition, lighting, and color grading. Professional appearance that builds trust and credibility.`;
  } else if (score >= 70) {
    return `Good visual quality overall. Some areas could benefit from improved lighting or better framing. Consider color correction for consistency.`;
  } else {
    return `Visual quality needs improvement. Consider upgrading equipment, improving lighting setup, or using better editing software. Poor visuals can significantly impact engagement.`;
  }
}

function generateCTAFeedback(score: number): string {
  if (score >= 85) {
    return `Clear and compelling call-to-action. The CTA is well-positioned, uses action-oriented language, and makes it easy for viewers to take the next step.`;
  } else if (score >= 70) {
    return `CTA is present but could be more compelling. Make it more specific, use stronger action verbs, and ensure it's visible at the right moment in the video.`;
  } else {
    return `CTA is weak or unclear. Viewers may not know what action to take. Make it more specific, urgent, and easy to follow. Consider A/B testing different CTAs.`;
  }
}

function generateEngagementFeedback(score: number): string {
  if (score >= 85) {
    return `High engagement potential. The content is likely to generate likes, comments, and shares. Strong emotional connection or valuable information that resonates with viewers.`;
  } else if (score >= 70) {
    return `Moderate engagement expected. Content is solid but may not strongly encourage interaction. Consider adding questions, polls, or calls for comments to boost engagement.`;
  } else {
    return `Low engagement potential. The content may not strongly encourage viewer interaction. Consider making it more relatable, asking questions, or including shareable moments.`;
  }
}

function generateRetentionFeedback(score: number, duration: number): string {
  const completionRate = Math.floor(score / 2);
  
  if (score >= 85) {
    return `Excellent retention! Expected completion rate of ${completionRate}%+. Viewers are likely to watch the entire video due to strong content and pacing.`;
  } else if (score >= 70) {
    return `Good retention with expected ${completionRate}% completion rate. Most viewers will watch a significant portion, but some may drop off in the middle.`;
  } else {
    return `Retention needs improvement. Expected completion rate of only ${completionRate}%. Many viewers may drop off early. Focus on stronger opening and maintaining interest throughout.`;
  }
}

function generateSummary(
  videoName: string,
  category: string,
  overallScore: number,
  feedbacks: Record<string, string>
): string {
  const performanceLevel = overallScore >= 85 ? 'excellent' : overallScore >= 70 ? 'good' : 'needs improvement';
  
  return `${videoName} (${category}) received an overall score of ${overallScore}/100, indicating ${performanceLevel} performance. 

Key strengths: ${overallScore >= 85 ? 'Strong visual quality and engaging content that maintains viewer attention' : overallScore >= 70 ? 'Solid foundation with room for optimization' : 'Basic structure in place but significant improvements needed'}.

Primary recommendations: ${overallScore >= 85 ? 'Maintain current quality standards and consider A/B testing variations to further optimize performance.' : overallScore >= 70 ? 'Focus on improving the weaker areas identified in detailed metrics to push performance into the excellent range.' : 'Prioritize improving the hook, pacing, and visual quality as these have the highest impact on overall performance.'}

This analysis is based on industry benchmarks for ${category.toLowerCase()} content and best practices for video performance optimization.`;
}

function generateRecommendations(overallScore: number, feedbacks: Record<string, string>): string[] {
  const recommendations: string[] = [];

  if (overallScore < 85) {
    recommendations.push('Consider A/B testing different thumbnails and titles to improve click-through rate');
    recommendations.push('Analyze audience retention graphs to identify specific drop-off points and optimize those sections');
  }

  if (overallScore < 70) {
    recommendations.push('Focus on the first 3 seconds - this is when most viewers decide whether to continue watching');
    recommendations.push('Break longer videos into shorter, more focused segments to improve completion rates');
    recommendations.push('Add visual variety (cuts, B-roll, graphics) to maintain viewer interest throughout');
  }

  recommendations.push('Track metrics over time to identify trends and measure the impact of optimizations');
  recommendations.push('Compare performance against industry benchmarks for similar content types');
  recommendations.push('Use viewer feedback and comments to inform future content strategy');

  return recommendations;
}

function getOptimalDuration(category: string): string {
  const durations: Record<string, string> = {
    'Marketing': '15-90 seconds',
    'Product Demo': '60-180 seconds',
    'Sales': '15-120 seconds',
    'Educational': '180-600 seconds',
    'Support': '60-300 seconds',
  };

  return durations[category] || '60-180 seconds';
}

// Allow running as standalone script
if (require.main === module) {
  const prisma = new PrismaClient();
  seedComprehensiveData(prisma)
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}

