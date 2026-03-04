// packages/model/ddd/valueObjects/dataHoraUTC.js
import { DomainError } from "../errors/domainError.js";
export class DataHoraUTC {
    constructor(value) {
        if (!DataHoraUTC.isValid(value)) {
            throw new DomainError("Invalid UTC datetime format.");
        }

        this.value = value;
        Object.freeze(this);
    }

    static isValid(value) {
        return typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value);
    }

    toString() {
        return this.value;
    }

    static now() {
        const date = new Date();
        return new DataHoraUTC(date.toISOString().replace(/\.\d{3}Z$/, "Z"));
    }
}