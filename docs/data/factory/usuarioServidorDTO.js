import { CreateBaseDTO } from './baseDTO.js';

export function CreateUsuarioServidorDTO(data) {
  return CreateBaseDTO({
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
