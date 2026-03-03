// packages/model/ddd/valueObjects/cpf.js
import { DomainError } from "../errors/domainError.js";

export class CPF {
    constructor(value) {
        if (!CPF.isValid(value)) {
            throw new DomainError("CPF inválido.");
        }
        this.value = CPF.#clean(value);
        Object.freeze(this);
    }

    static #clean(value) {
        return value.replace(/\D/g, "");
    }

    static isValid(value) {
        if (!value) return false;

        const cpf = CPF.#clean(value);
        if (cpf.length !== 11) return false;
        if (/^(\d)\1+$/.test(cpf)) return false; // todos dígitos iguais

        // valida primeiro dígito
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf[i]) * (10 - i);
        }
        let resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        // valida segundo dígito
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf[i]) * (11 - i);
        }
        resto = (soma * 10) % 11;
        if (resto === 10) resto = 0;
        if (resto !== parseInt(cpf[10])) return false;

        return true;
    }

    toString() {
        return this.value;
    }
}