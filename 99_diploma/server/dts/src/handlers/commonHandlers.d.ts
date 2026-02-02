import type { Response } from "express";
export declare const handleAuthError: (res: Response, code: number, message?: string) => void;
export declare const handleAuthSuccess: (res: Response, code: number, message?: string) => void;
export declare const handleApiError: (res: Response, code: number, message?: string) => void;
