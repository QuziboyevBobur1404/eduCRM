"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_dto_1 = require("../common/dto/pagination.dto");
let ExamsService = class ExamsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, tenantId, createdById) {
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
    async findAll(tenantId, groupId, page = 1, limit = 20) {
        const where = { tenantId, ...(groupId && { groupId }) };
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
        return new pagination_dto_1.PaginatedResult(data, total, page, limit);
    }
    async findOne(id, tenantId) {
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
        if (!exam)
            throw new common_1.NotFoundException('Imtihon topilmadi');
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
    async submitResults(examId, dto, tenantId) {
        const exam = await this.prisma.exam.findFirst({ where: { id: examId, tenantId } });
        if (!exam)
            throw new common_1.NotFoundException('Imtihon topilmadi');
        const results = await Promise.all(dto.results.map((r) => this.prisma.examResult.upsert({
            where: { examId_studentId: { examId, studentId: r.studentId } },
            create: { examId, studentId: r.studentId, score: r.score, notes: r.notes },
            update: { score: r.score, notes: r.notes },
        })));
        const sorted = [...results].sort((a, b) => Number(b.score) - Number(a.score));
        await Promise.all(sorted.map((r, i) => this.prisma.examResult.update({ where: { id: r.id }, data: { rank: i + 1 } })));
        return { message: `${results.length} ta natija saqlandi`, results };
    }
    async getGroupExamStats(groupId, tenantId) {
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
};
exports.ExamsService = ExamsService;
exports.ExamsService = ExamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExamsService);
//# sourceMappingURL=exams.service.js.map