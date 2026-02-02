import type { Age, AgeData, Creds, UrlOptions } from "../types.js";
export declare const hashText: (text: string) => string;
export declare const getCreds: (data: any) => Creds | undefined;
export declare const getUrl: (options: UrlOptions) => URL;
export declare const getAgeData: (age: Age) => AgeData;
export declare const getOffset: (page: number) => number;
export declare const isInt: (value: string) => boolean;
