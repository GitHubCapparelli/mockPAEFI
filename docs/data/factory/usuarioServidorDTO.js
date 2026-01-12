import { BaseDTO } from './baseDTO.js';

export function UsuarioServidorDTO(data) {
  return BaseDTO({
    unidadeID      : data.unidadeID,
    nome           : data.nome,
    login          : data.login,
    matricula      : data.matricula,
    cpf            : data.cpf,
    funcao         : data.funcao,
    cargo          : data.cargo,
    especialidade  : data.especialidade,
    criadoPor      : data.criadoPor
  });
}
