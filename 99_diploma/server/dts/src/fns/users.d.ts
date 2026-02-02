export declare const configUsers: () => Promise<boolean>;
export declare const setCredential: (user: string, password: string) => Promise<string>;
export declare const findPassword: (user: string) => Promise<string>;
