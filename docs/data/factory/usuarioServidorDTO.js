import { CreateBaseDTO } from './baseDTO.js';

export const FuncaoServidor = Object.freeze({
  NAO_INFORMADO : 'NaoInformado',
  ASSESSOR      : 'Assessor',
  DIRETOR       : 'Diretor',
  GERENTE       : 'Gerente'
});

export const CargoServidor = Object.freeze({
  NAO_INFORMADO : 'NaoInformado',
  ESPECIALISTA  : 'Especialista',
  TECNICO       : 'Tecnico'
});

export function CreateUsuarioServidorDTO(data) {
  return CreateBaseDTO({
    unidadeID      : data.unidadeID,
    nome           : data.nome,
    funcao         : data.funcao,
    cargo          : data.cargo,
    especialidade  : data.especialidade,
    login          : data.login
  });
}
