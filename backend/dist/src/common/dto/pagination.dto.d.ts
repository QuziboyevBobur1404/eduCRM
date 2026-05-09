export declare class PaginationDto {
    page?: number;
    limit?: number;
    search?: string;
    sortOrder?: 'asc' | 'desc';
    sortBy?: string;
}
export declare class PaginatedResult<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    constructor(data: T[], total: number, page: number, limit: number);
}
