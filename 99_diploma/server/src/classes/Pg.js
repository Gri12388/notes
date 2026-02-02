import knex from "knex";
import { PGCONFIG } from "../constants.js";
export class Pg {
    static instance = new Pg();
    pg = knex({
        client: "pg",
        connection: PGCONFIG,
    });
    constructor() { }
    static getInstance() {
        return Pg.instance;
    }
    getPg() {
        return this.pg;
    }
}
//# sourceMappingURL=Pg.js.map