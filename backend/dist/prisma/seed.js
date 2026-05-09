"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    const tenant = await prisma.tenant.upsert({
        where: { slug: 'demo-center' },
        update: {},
        create: {
            name: "Demo Ta'lim Markazi",
            slug: 'demo-center',
            plan: 'STARTER',
            maxStudents: 500,
            maxTeachers: 20,
        },
    });
    console.log('✅ Tenant:', tenant.name);
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD || 'Admin@12345', 12);
    const superAdmin = await prisma.user.upsert({
        where: { email: process.env.SUPER_ADMIN_EMAIL || 'admin@educrm.uz' },
        update: {},
        create: {
            email: process.env.SUPER_ADMIN_EMAIL || 'admin@educrm.uz',
            password: hashedPassword,
            firstName: 'Super',
            lastName: 'Admin',
            role: 'SUPER_ADMIN',
            tenantId: tenant.id,
        },
    });
    console.log('✅ Super Admin:', superAdmin.email);
    const ielts = await prisma.course.upsert({
        where: { id: 'course-ielts-001' },
        update: {},
        create: {
            id: 'course-ielts-001',
            name: 'IELTS',
            description: 'IELTS tayyorlov kursi',
            duration: 6,
            level: 'Intermediate',
            monthlyPrice: 500000,
            tenantId: tenant.id,
        },
    });
    await prisma.course.upsert({
        where: { id: 'course-math-001' },
        update: {},
        create: {
            id: 'course-math-001',
            name: 'Matematika',
            description: 'Matematika kursi',
            duration: 3,
            level: 'Beginner',
            monthlyPrice: 350000,
            tenantId: tenant.id,
        },
    });
    console.log('✅ Courses created');
    const teacherPassword = await bcrypt.hash('Teacher@123', 12);
    const teacherUser = await prisma.user.upsert({
        where: { email: 'teacher@educrm.uz' },
        update: {},
        create: {
            email: 'teacher@educrm.uz',
            password: teacherPassword,
            firstName: 'Akbar',
            lastName: 'Rahimov',
            role: 'TEACHER',
            tenantId: tenant.id,
        },
    });
    const teacher = await prisma.teacher.upsert({
        where: { userId: teacherUser.id },
        update: {},
        create: {
            userId: teacherUser.id,
            tenantId: tenant.id,
            speciality: 'IELTS',
            salary: 3000000,
        },
    });
    console.log('✅ Teacher:', teacherUser.email);
    const group = await prisma.group.upsert({
        where: { id: 'group-ielts-001' },
        update: {},
        create: {
            id: 'group-ielts-001',
            name: 'IELTS Beginner N1',
            courseId: ielts.id,
            teacherId: teacher.id,
            capacity: 12,
            roomNumber: '101',
            tenantId: tenant.id,
        },
    });
    await prisma.schedule.createMany({
        data: [
            { groupId: group.id, dayOfWeek: 1, startTime: '09:00', endTime: '11:00' },
            { groupId: group.id, dayOfWeek: 3, startTime: '09:00', endTime: '11:00' },
            { groupId: group.id, dayOfWeek: 5, startTime: '09:00', endTime: '11:00' },
        ],
        skipDuplicates: true,
    });
    const students = [
        { firstName: 'Jasur', lastName: 'Toshmatov', phone: '+998901111001', gender: 'MALE' },
        { firstName: 'Nilufar', lastName: 'Karimova', phone: '+998901111002', gender: 'FEMALE' },
        { firstName: 'Bobur', lastName: 'Aliyev', phone: '+998901111003', gender: 'MALE' },
        { firstName: 'Zulfiya', lastName: 'Yusupova', phone: '+998901111004', gender: 'FEMALE' },
        { firstName: 'Sherzod', lastName: 'Nazarov', phone: '+998901111005', gender: 'MALE' },
    ];
    for (const s of students) {
        const student = await prisma.student.upsert({
            where: { id: `student-${s.phone.slice(-3)}` },
            update: {},
            create: {
                id: `student-${s.phone.slice(-3)}`,
                firstName: s.firstName,
                lastName: s.lastName,
                phone: s.phone,
                gender: s.gender,
                status: 'ACTIVE',
                tenantId: tenant.id,
            },
        });
        await prisma.groupStudent.upsert({
            where: { groupId_studentId: { groupId: group.id, studentId: student.id } },
            update: {},
            create: { groupId: group.id, studentId: student.id },
        });
    }
    console.log(`✅ ${students.length} students created`);
    console.log('\n🎉 Seed completed!');
    console.log('📧 Super Admin:', superAdmin.email);
    console.log('🔑 Password:', process.env.SUPER_ADMIN_PASSWORD || 'Admin@12345');
    console.log('📧 Teacher:', teacherUser.email);
    console.log('🔑 Password: Teacher@123');
}
main()
    .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map