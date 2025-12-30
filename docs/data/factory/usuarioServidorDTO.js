import { CreateBaseDTO } from './baseDTO.js';

export function CreateUsuarioServidorDTO(data) {
  return CreateBaseDTO({
    unidadeID      : data.unidadeID,
    nome           : data.nome,
    login          : data.login,
    funcao         : data.funcao,
    cargo          : data.cargo,
    especialidade  : data.especialidade,
    criadoPor      : data.criadoPor
  });
}
