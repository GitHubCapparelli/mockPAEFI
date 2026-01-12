import { CoreAPI }    from './coreAPI.js';
import { UnidadeDTO } from '../../data/factory/unidadeDTO.js';

export const UnidadesAPI = CoreAPI({
  entity: 'unidades',
  dataPath: '/mockPAEFI/data/mock/unidades.json',
  jsonRoot: 'unidades',
  defaultOrderBy: 'nome',

  dto: UnidadeDTO,

  applyFilters(data, filters) {
    let result = data;

    if (filters.funcao) {
      result = result.filter(u => u.funcao === filters.funcao);
    }

    result = result.filter(u => !u.excluidoEm);
    return result;
  },

  validateCreate(dto, data) {
    if (data.some(u => u.sigla === dto.sigla
      || u.nome === dto.nome
      || u.IbgeId === dto.IbgeId)) {
      throw new Error('Já existe servidor(a) com esse nome, sigla ou IBGE Id');
    }
  }
});