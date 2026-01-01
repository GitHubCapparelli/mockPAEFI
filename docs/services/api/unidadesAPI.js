import { CreateBaseAPI }    from './baseAPI.js';
import { CreateUnidadeDTO } from '../../data/factory/unidadeDTO.js';

export const UnidadesAPI = CreateBaseAPI({
  entity         : 'unidades',
  dataPath       : '/mockPAEFI/data/mock/unidades.json',
  jsonRoot       : 'unidades',
  defaultOrderBy : 'sigla',

  createDTO: CreateUnidadeDTO,

  validateCreate(dto, data) {
    if (data.some(u => u.sigla === dto.sigla 
                    || u.nome === dto.nome)) {
      throw new Error('Já existe unidade com esse nome/sigla');
    }
  }
});