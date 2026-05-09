export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  FROZEN = 'FROZEN',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CLICK = 'CLICK',
}

export enum NotificationType {
  PAYMENT_DUE = 'PAYMENT_DUE',
  PAYMENT_OVERDUE = 'PAYMENT_OVERDUE',
  STUDENT_INACTIVE = 'STUDENT_INACTIVE',
  NEW_STUDENT = 'NEW_STUDENT',
  EXAM_RESULT = 'EXAM_RESULT',
  ATTENDANCE_ALERT = 'ATTENDANCE_ALERT',
  SYSTEM = 'SYSTEM',
}

export enum NotificationChannel {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum Plan {
  STARTER = 'STARTER',
  GROWTH = 'GROWTH',
  ENTERPRISE = 'ENTERPRISE',
}
