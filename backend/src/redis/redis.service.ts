// redis/redis.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.config.get('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6379),
      password: this.config.get('REDIS_PASSWORD'),
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });

    this.client.on('connect', () => console.log('✅ Redis connected'));
    this.client.on('error', (err) => console.error('❌ Redis error:', err));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  // ── Token helpers ──────────────────────────────────────────
  async setRefreshToken(userId: string, token: string, ttlSeconds = 604800) {
    await this.client.setex(`refresh:${userId}`, ttlSeconds, token);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    return this.client.get(`refresh:${userId}`);
  }

  async deleteRefreshToken(userId: string) {
    await this.client.del(`refresh:${userId}`);
  }

  // ── Cache helpers ─────────────────────────────────────────
  async set(key: string, value: any, ttlSeconds?: number) {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, serialized);
    } else {
      await this.client.set(key, serialized);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async delPattern(pattern: string) {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) await this.client.del(...keys);
  }

  // ── Feature flags ─────────────────────────────────────────
  async getFeatureFlag(tenantId: string, flag: string): Promise<boolean> {
    const value = await this.client.hget(`flags:${tenantId}`, flag);
    return value === '1';
  }
}
