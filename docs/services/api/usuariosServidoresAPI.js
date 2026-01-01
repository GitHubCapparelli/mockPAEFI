import { CreateBaseAPI }            from './baseAPI.js';
import { CreateUsuarioServidorDTO } from '../../data/factory/usuarioServidorDTO.js';

export const UnidadesAPI = CreateBaseAPI({
  entity         : 'usuariosServidores',
  dataPath       : '/mockPAEFI/data/mock/usuariosServidores.json',
  jsonRoot       : 'usuariosServidores',
  defaultOrderBy : 'nome',

  createDTO: CreateUnidadeServidorDTO,

  validateCreate(dto, data) {
    if (data.some(u => u.cpf       === dto.cpf
                    || u.login     === dto.login 
                    || u.matricula === dto.matricula)) {
      throw new Error('Já existe servidor(a) com esse login, matrícula ou CPF');
    }
  }
});
