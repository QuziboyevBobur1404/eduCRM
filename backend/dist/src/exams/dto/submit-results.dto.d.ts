export declare class ExamResultItemDto {
    studentId: string;
    score: number;
    notes?: string;
}
export declare class SubmitExamResultsDto {
    results: ExamResultItemDto[];
}
