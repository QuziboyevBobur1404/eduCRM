import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async get(tenantId: string, key: string) {
    const setting = await this.prisma.setting.findUnique({
      where: { tenantId_key: { tenantId, key } },
    });
    return setting ? setting.value : null;
  }

  async getAll(tenantId: string) {
    const settings = await this.prisma.setting.findMany({
      where: { tenantId },
      orderBy: { key: 'asc' },
    });
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  }

  async set(tenantId: string, key: string, value: any) {
    return this.prisma.setting.upsert({
      where: { tenantId_key: { tenantId, key } },
      create: { tenantId, key, value },
      update: { value },
    });
  }

  async setMany(tenantId: string, data: Record<string, any>) {
    const results = await Promise.all(
      Object.entries(data).map(([key, value]) =>
        this.set(tenantId, key, value),
      ),
    );
    return { updated: results.length };
  }

  async delete(tenantId: string, key: string) {
    await this.prisma.setting.deleteMany({
      where: { tenantId, key },
    });
    return { message: 'Sozlama o\'chirildi' };
  }
}
