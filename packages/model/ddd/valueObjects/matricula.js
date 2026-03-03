// packages/model/ddd/valueObjects/matricula.js
import { DomainError } from "../errors/domainError.js";

export class Matricula {
    constructor(value) {
        if (!Matricula.isValid(value)) {
            throw new DomainError("Matrícula inválida.");
        }
        this.value = value.replace(/\D/g, "");
        Object.freeze(this);
    }

    static isValid(value) {
        if (!value) return false;

        const clean = value.replace(/\D/g, "");

        return clean.length === 8;
    }

    toString() {
        return this.value;
    }
}