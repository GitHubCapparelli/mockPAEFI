import { BaseDTO } from './baseDTO.js';

export function CatalogoDTO(data, audit = {}) {
  return BaseDTO({
    nome         : data.nome,
    versao       : data.versao,
    finalidade   : data.finalidade ?? null,
    ...audit
  });
}