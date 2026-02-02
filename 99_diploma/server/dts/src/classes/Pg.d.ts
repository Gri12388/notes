import knex from "knex";
export declare class Pg {
    private static instance;
    private pg;
    private constructor();
    static getInstance(): Pg;
    getPg(): knex.Knex<any, unknown[]>;
}
