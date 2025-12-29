import { createBaseDTO } from './baseDTO.js';

export function CreateUnidadeDTO(data) {
  return CreateBaseDTO({
    hierarquiaID : data.hierarquiaID ?? null,
    sigla        : data.sigla,
    nome         : data.nome,
    funcao       : data.funcao,
    ibgeId       : data.ibgeId ?? null
  });
}
