import { NextRequest } from 'next/server';

interface RateLimitInfo {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitInfo>();

const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 requests per window per IP
  message: 'Too many requests, please try again later',
};

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  // Fallback for development
  return 'localhost';
}

export function checkRateLimit(clientIp: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  message?: string;
} {
  const now = Date.now();
  
  // Clean up expired entries
  for (const [ip, info] of rateLimitStore.entries()) {
    if (info.resetTime < now) {
      rateLimitStore.delete(ip);
    }
  }
  
  const current = rateLimitStore.get(clientIp);
  
  if (!current || current.resetTime < now) {
    // First request or window expired
    const newInfo: RateLimitInfo = {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs,
    };
    rateLimitStore.set(clientIp, newInfo);
    
    return {
      allowed: true,
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1,
      resetTime: newInfo.resetTime,
    };
  }
  
  if (current.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: current.resetTime,
      message: RATE_LIMIT_CONFIG.message,
    };
  }
  
  // Increment count
  current.count++;
  rateLimitStore.set(clientIp, current);
  
  return {
    allowed: true,
    remaining: RATE_LIMIT_CONFIG.maxRequests - current.count,
    resetTime: current.resetTime,
  };
}

export function getRateLimitHeaders(rateLimitInfo: ReturnType<typeof checkRateLimit>) {
  return {
    'X-RateLimit-Limit': RATE_LIMIT_CONFIG.maxRequests.toString(),
    'X-RateLimit-Remaining': rateLimitInfo.remaining.toString(),
    'X-RateLimit-Reset': new Date(rateLimitInfo.resetTime).toISOString(),
  };
}