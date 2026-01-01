import { CreateCoreAPI }            from './coreAPI.js';
import { CreateUsuarioServidorDTO } from '../../data/factory/usuarioServidorDTO.js';

export const UsuariosServidoresAPI = CreateCoreAPI({
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
