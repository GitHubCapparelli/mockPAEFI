// ui paefi domain domainView

import { Render }       from '../core/renderer.js';
import { DomainInfo }   from '../core/omData.js';
import { FuncaoUsuario, CargoUsuario, Especialidade,
         Dominio, Modulo 
       } from '../core/omEnum.js';

class DomainView {
    constructor(moduleKey, info, namedLists, fnOnModalSubmited) {
        this.moduleKey  = moduleKey;
        this.info       = info;
        this.lookups    = namedLists;

        this.addModal   = new Modal('add-modal',  `Novo ${info.Name}`,      fnOnModalSubmited);
        this.editModal  = new Modal('edit-modal', `Editando ${info.Name}`,  fnOnModalSubmited);
    }

    static async Create(moduleKey, info, fnOnModalSubmited) {
        const apiTasks   = Object.entries(info.Lookups).map(async ([key, api]) => {
            const data   = await api.GetAll(); 
            return [key, data];
        });
        const response   = await Promise.all(apiTasks);
        const namedLists = Object.fromEntries(response);
        const instance   = new DomainView(moduleKey, info, namedLists, fnOnModalSubmited);
        instance.view();
        return instance;
    }  
    
    Filters() {
        const $container = $('#divFilterOptions').empty();

        if (this.info.Key === DomainInfo.UsuariosServidores.Key) {
            $container.append(
            Render.Select('cmbFilterUnidade', 'Todas as Unidades'),
            Render.Select('cmbFilterEspecialidade', 'Todas as Especialidades'),
            Render.Select('cmbFilterFuncao', 'Todas as Funções'),
            Render.Select('cmbFilterCargo', 'Todos os Cargos')
            );
        }
        // Unidades...
        this.FiltersItems();
    }

    FiltersItems() {
        const $el  = $('#cmbFilterUnidade');
        this.lookups.unidades.forEach(u => $el.append($('<option>', { value: u.id, text: u.sigla })));

        Render.Enum('#cmbFilterEspecialidade', Especialidade);
        Render.Enum('#cmbFilterFuncao', FuncaoUsuario);
        Render.Enum('#cmbFilterCargo', CargoUsuario);
    }

    Rows_old(response) {
        const list  = response.data;
        const tbody = $('#dataRows').empty();

        if (!list.length) {
        tbody.append(`<tr><td colspan="${columns.length}">Nenhum registro</td></tr>`);
        return;
        }

        list.forEach(u => {
        tbody.append(`<tr>
            <td class="ellipsis25" title="${u.nome}">${u.nome}</td>
            <td>${this.lookups.unidades?.find(un => un.id === u.unidadeID)?.sigla ?? ''}</td>
            <td>${u.especialidade === Especialidade.NaoInformada.Key ? '' : Especialidade.ValueFromKey(u.especialidade)}</td>
            <td>${u.funcao === FuncaoUsuario.NaoInformada.Key ? '' : FuncaoUsuario.ValueFromKey(u.funcao)}</td>
            <td>${u.cargo === CargoUsuario.NaoInformado.Key ? '' : CargoUsuario.ValueFromKey(u.cargo)}</td>
            <td>
                <button class="btn btn-sm btn-primary js-edit" data-id="${u.id}" title="Editar">
                <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger js-delete" data-id="${u.id}" title="Deletar">
                <i class="fas fa-trash"></i>
                </button>
            </td>
            </tr>
        `);
        });

        Render.Info(response.pagination);
    }

    Rows(response) {
        const tbody = $('#dataRows').empty();
        const rows  = response.data;

        if (!rows.length) {
            tbody.append(
                $('<tr>').append(
                    $('<td>', {
                        colspan: this.info.Catalog.VisibleCount + 1,
                        text: 'Nenhum registro'
                    })
                )
            );
            return;
        }

        rows.forEach(dto => {
            const $tr = $('<tr>');

            this.info.Catalog.Campos
                .filter(c => c.Visible)
                .forEach(c => {
                    const value = this.resolveCellValue(dto, c);
                    $tr.append(
                        $('<td>', { text: value })
                            .toggleClass('ellipsis25', c.UiKey === 'nome')
                    );
                });

            if (this.moduleKey === Modulo.Admin.Key) {
                $tr.append(Render.AdminActions(dto.id));
            }

            tbody.append($tr);
        });

        Render.Info(response.pagination);
    }

    resolveCellValue(dto, campo) {
        if (campo.Lookup) {
            return this.lookups[campo.Lookup]
                ?.find(x => x.id === dto[campo.Key])?.sigla ?? '';
        }

        if (campo.Enum) {
            return campo.Enum.ValueFromKey(dto[campo.Key]) ?? '';
        }

        return dto[campo.Key] ?? '';
    }


    async view() {
        if (this.moduleKey === Modulo.Admin.Key) {
            await this.viewAdmin();
        }
    }

    async viewAdmin() {
        //this.Filters();
        //Render.Table(columns);

        Render.ClearMain();
        Render.FiltersFromCatalog(this.info);
        Render.TableFromCatalog(this.info, this.moduleKey);
    }    
}