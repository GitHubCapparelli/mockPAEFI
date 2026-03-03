// packages/model/ddd/valueObjects/uuid.js
import { DomainError } from "../errors/domainError.js";

export class UUID {
    constructor(value) {
        if (!UUID.isValid(value)) {
            throw new DomainError("Invalid UUID format.");
        }

        this.value = value;
        Object.freeze(this);
    }

    static isValid(value) {
        return typeof value === "string" &&
            /^[0-9a-fA-F-]{36}$/.test(value);
    }

    toString() {
        return this.value;
    }
}