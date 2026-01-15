import { CoreAPI }     from './coreAPI.js';
import { CatalogoDTO } from '../../data/factory/catalogoDTO.js';

export const CatalogosAPI = CoreAPI({
  entity            : 'catalogos',
  dataPath          : '/mockPAEFI/data/mock/catalogos.json',
  jsonRoot          : 'catalogos',
  defaultOrderBy    : 'nome',
  createDTO         : CatalogoDTO,

  applyFilters(data, filters) {
      let result = data;
      result = result.filter(u => !u.excluidoEm);
      return result;
  },

  validateCreate(dto, data) {
      if (data.some(u => u.nome === dto.nome)) {
        throw new Error('Já existe tabela com esse nome');
      }
  }
});