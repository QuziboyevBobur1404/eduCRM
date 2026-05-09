"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = exports.NotificationChannel = exports.NotificationType = exports.PaymentMethod = exports.PaymentStatus = exports.AttendanceStatus = exports.StudentStatus = exports.Gender = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["TEACHER"] = "TEACHER";
})(Role || (exports.Role = Role = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
})(Gender || (exports.Gender = Gender = {}));
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["ACTIVE"] = "ACTIVE";
    StudentStatus["INACTIVE"] = "INACTIVE";
    StudentStatus["FROZEN"] = "FROZEN";
})(StudentStatus || (exports.StudentStatus = StudentStatus = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["ABSENT"] = "ABSENT";
    AttendanceStatus["LATE"] = "LATE";
    AttendanceStatus["EXCUSED"] = "EXCUSED";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["OVERDUE"] = "OVERDUE";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CLICK"] = "CLICK";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["PAYMENT_DUE"] = "PAYMENT_DUE";
    NotificationType["PAYMENT_OVERDUE"] = "PAYMENT_OVERDUE";
    NotificationType["STUDENT_INACTIVE"] = "STUDENT_INACTIVE";
    NotificationType["NEW_STUDENT"] = "NEW_STUDENT";
    NotificationType["EXAM_RESULT"] = "EXAM_RESULT";
    NotificationType["ATTENDANCE_ALERT"] = "ATTENDANCE_ALERT";
    NotificationType["SYSTEM"] = "SYSTEM";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "IN_APP";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var Plan;
(function (Plan) {
    Plan["STARTER"] = "STARTER";
    Plan["GROWTH"] = "GROWTH";
    Plan["ENTERPRISE"] = "ENTERPRISE";
})(Plan || (exports.Plan = Plan = {}));
//# sourceMappingURL=index.js.map