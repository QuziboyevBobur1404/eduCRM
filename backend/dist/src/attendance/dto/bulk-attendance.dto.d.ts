import { AttendanceStatus } from '../../common/enums/index';
export declare class AttendanceRecordDto {
    studentId: string;
    status: AttendanceStatus;
    notes?: string;
}
export declare class BulkAttendanceDto {
    groupId: string;
    date: string;
    lessonNum: number;
    records: AttendanceRecordDto[];
}
