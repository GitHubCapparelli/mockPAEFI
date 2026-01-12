import { BaseDTO } from './baseDTO.js';

export function UnidadeDTO(data, audit = {}) {
  return BaseDTO({
    hierarquiaID : data.hierarquiaID ?? null,
    sigla        : data.sigla,
    nome         : data.nome,
    funcao       : data.funcao,
    ibgeId       : data.ibgeId ?? null,
    ...audit
  });
}
