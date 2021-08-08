export class ApiError extends Error {
    private statusCode: number;
    private status: boolean;
    constructor(status: boolean, statusCode: number, message?: string) {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
    }
}