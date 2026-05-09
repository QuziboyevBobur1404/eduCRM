import { cn } from '@/lib/utils';

type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'FROZEN';
type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';
type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

const studentStatusMap: Record<StudentStatus, { label: string; classes: string }> = {
  ACTIVE: { label: 'Faol', classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
  INACTIVE: { label: 'Nofaol', classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  FROZEN: { label: 'Muzlatilgan', classes: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400' },
};

const paymentStatusMap: Record<PaymentStatus, { label: string; classes: string }> = {
  PAID: { label: "To'langan", classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' },
  PENDING: { label: 'Kutilmoqda', classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400' },
  OVERDUE: { label: "Muddati o'tgan", classes: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400' },
};

const attendanceStatusMap: Record<AttendanceStatus, { label: string; classes: string }> = {
  PRESENT: { label: 'Keldi', classes: 'bg-emerald-50 text-emerald-700' },
  ABSENT: { label: 'Kelmadi', classes: 'bg-red-50 text-red-700' },
  LATE: { label: 'Kech keldi', classes: 'bg-amber-50 text-amber-700' },
  EXCUSED: { label: 'Sababli', classes: 'bg-blue-50 text-blue-700' },
};

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  const config = studentStatusMap[status] ?? { label: status, classes: 'bg-gray-100 text-gray-600' };
  return (
    <span className={cn('inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full', config.classes)}>
      {config.label}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = paymentStatusMap[status] ?? { label: status, classes: 'bg-gray-100 text-gray-600' };
  return (
    <span className={cn('inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full', config.classes)}>
      {config.label}
    </span>
  );
}

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const config = attendanceStatusMap[status] ?? { label: status, classes: 'bg-gray-100 text-gray-600' };
  return (
    <span className={cn('inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full', config.classes)}>
      {config.label}
    </span>
  );
}
