// ui paefi core omData

import { QueryEngine, CommandEngine, Modal }  from '../core/omClass.js';
import { UnidadesAPI }                        from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI }              from '../../../services/api/usuariosServidoresAPI.js';
import {
  FuncaoUsuario, CargoUsuario, Especialidade,
  Dominio, Modulo
} from '../core/omEnum.js';

export class UsuariosServidoresSpec {
    static All = [];

    constructor(key, value) {
        this.Key = key;
        this.Value = value;
        this.JQuery = `#${key}`;

        if (!DocLinks.All.some(x => x.Key === key)) {
            DocLinks.All.push(this);
        }
        Object.freeze(this);
    }

    static FromKey(key)        { return DocLinks.All.find(x => x.Key === key) ?? null; }
    static FromValue(value)    { return DocLinks.All.find(x => x.Value === value) ?? null; }
    static ValueFromKey(key)   { return DocLinks.FromKey(key)?.Value ?? null; }
    static KeyFromValue(value) { return DocLinks.FromValue(value)?.Key ?? null; }

    static DocExecutivo        = new DocLinks('docExecutivo','Documento Executivo');
    static DocTecnico          = new DocLinks('docTecnico','Documetação Técnica');
    static DocUsuario          = new DocLinks('docUsuario','Manual do Usuário');
 
    toJSON() { return this.Key; }
}
Object.freeze(DocLinks.All);

const columns = [
  { label: 'Nome', field: 'nome' },
  { label: 'Unidade', field: 'unidade' },
  { label: 'Especialidade', field: 'especialidade' },
  { label: 'Função', field: 'funcao' },
  { label: 'Cargo', field: 'cargo' },
  { label: 'Ações', field: 'acoes' }
];

  getFilters() {
    return {
      unidadeID      : $('#cmbFilterUnidade').val() || null,
      especialidade  : $('#cmbFilterEspecialidade').val() || null,
      funcao         : $('#cmbFilterFuncao').val() || null,
      cargo          : $('#cmbFilterCargo').val() || null
    };
  }


