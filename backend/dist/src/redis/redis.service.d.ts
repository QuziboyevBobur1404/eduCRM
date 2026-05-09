import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleInit, OnModuleDestroy {
    private config;
    private client;
    constructor(config: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): Promise<void>;
    getClient(): Redis;
    setRefreshToken(userId: string, token: string, ttlSeconds?: number): Promise<void>;
    getRefreshToken(userId: string): Promise<string | null>;
    deleteRefreshToken(userId: string): Promise<void>;
    set(key: string, value: any, ttlSeconds?: number): Promise<void>;
    get<T>(key: string): Promise<T | null>;
    del(key: string): Promise<void>;
    delPattern(pattern: string): Promise<void>;
    getFeatureFlag(tenantId: string, flag: string): Promise<boolean>;
}
