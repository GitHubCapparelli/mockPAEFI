// ui paefi core omData

import { QueryEngine, CommandEngine, Modal }  from '../core/omClass.js';
import { UnidadesAPI }                        from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI }              from '../../../services/api/usuariosServidoresAPI.js';
import {
  FuncaoUsuario, CargoUsuario, Especialidade,
  Dominio, Modulo
} from '../core/omEnum.js';

//
export class UsuariosServidoresSpecs {
    constructor() {
        this.api            = UsuariosServidoresAPI;
        this.lookups        = { unidades: UnidadesAPI.GetAll() };
        this.gridColumns    = [
            { title: 'Nome',            dto: 'nome' },
            { title: 'Unidade',         dto: 'unidade' },
            { title: 'Especialidade',   dto: 'especialidade' },
            { title: 'Função',          dto: 'funcao' },
            { title: 'Cargo',           dto: 'cargo' }
        ];
        Object.freeze(this);
    }

    apiFilters() {
        return {
        unidadeID      : $('#cmbFilterUnidade').val()       || null,
        especialidade  : $('#cmbFilterEspecialidade').val() || null,
        funcao         : $('#cmbFilterFuncao').val()        || null,
        cargo          : $('#cmbFilterCargo').val()         || null
        };
    }
  
    modalRequested(action, data, id = null) {
        if (action === 'create') {
            this.command.Create(data);
        } 
        if (action === 'update') {
            this.command.Update(id, data);
        } 
    }
}
