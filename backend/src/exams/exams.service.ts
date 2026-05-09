import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginatedResult } from '../common/dto/pagination.dto';
import { CreateExamDto } from './dto/create-exam.dto';
import { SubmitExamResultsDto } from './dto/submit-results.dto';

@Injectable()
export class ExamsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateExamDto, tenantId: string, createdById: string) {
    return this.prisma.exam.create({
      data: {
        title: dto.title,
        groupId: dto.groupId,
        maxScore: dto.maxScore,
        date: new Date(dto.date),
        description: dto.description,
        tenantId,
        createdById,
      },
    });
  }

  async findAll(tenantId: string, groupId?: string, page = 1, limit = 20) {
    const where: any = { tenantId, ...(groupId && { groupId }) };
    const [data, total] = await Promise.all([
      this.prisma.exam.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { date: 'desc' },
        include: {
          group: { select: { id: true, name: true } },
          _count: { select: { results: true } },
        },
      }),
      this.prisma.exam.count({ where }),
    ]);
    return new PaginatedResult(data, total, page, limit);
  }

  async findOne(id: string, tenantId: string) {
    const exam = await this.prisma.exam.findFirst({
      where: { id, tenantId },
      include: {
        group: { select: { id: true, name: true } },
        results: {
          include: {
            student: {
              select: { id: true, firstName: true, lastName: true, avatar: true },
            },
          },
          orderBy: { score: 'desc' },
        },
      },
    });
    if (!exam) throw new NotFoundException('Imtihon topilmadi');

    const scores = exam.results.map((r) => Number(r.score));
    const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

    return {
      ...exam,
      results: exam.results.map((r, i) => ({
        ...r,
        rank: i + 1,
        percentage: ((Number(r.score) / Number(exam.maxScore)) * 100).toFixed(1),
      })),
      stats: {
        avg: avg.toFixed(1),
        max: scores.length ? Math.max(...scores) : 0,
        min: scores.length ? Math.min(...scores) : 0,
        count: scores.length,
        passRate: scores.length
          ? ((scores.filter((s) => s >= Number(exam.maxScore) * 0.6).length / scores.length) * 100).toFixed(1)
          : '0',
      },
    };
  }

  async submitResults(examId: string, dto: SubmitExamResultsDto, tenantId: string) {
    const exam = await this.prisma.exam.findFirst({ where: { id: examId, tenantId } });
    if (!exam) throw new NotFoundException('Imtihon topilmadi');

    const results = await Promise.all(
      dto.results.map((r) =>
        this.prisma.examResult.upsert({
          where: { examId_studentId: { examId, studentId: r.studentId } },
          create: { examId, studentId: r.studentId, score: r.score, notes: r.notes },
          update: { score: r.score, notes: r.notes },
        }),
      ),
    );

    // Update rankings
    const sorted = [...results].sort((a, b) => Number(b.score) - Number(a.score));
    await Promise.all(
      sorted.map((r, i) =>
        this.prisma.examResult.update({ where: { id: r.id }, data: { rank: i + 1 } }),
      ),
    );

    return { message: `${results.length} ta natija saqlandi`, results };
  }

  async getGroupExamStats(groupId: string, tenantId: string) {
    const exams = await this.prisma.exam.findMany({
      where: { groupId, tenantId },
      include: { results: { select: { score: true } } },
      orderBy: { date: 'asc' },
    });

    return exams.map((exam) => {
      const scores = exam.results.map((r) => Number(r.score));
      return {
        id: exam.id,
        title: exam.title,
        date: exam.date,
        maxScore: exam.maxScore,
        avg: scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0',
        count: scores.length,
      };
    });
  }
}
