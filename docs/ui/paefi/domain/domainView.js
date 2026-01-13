// ui paefi domain domainView

import { Render }       from '../core/renderer.js';
import { DomainInfo }   from '../core/omData.js';
import { Modal }        from '../core/omClass.js';
import { FuncaoUsuario, CargoUsuario, Especialidade, Modulo } from '../core/omEnum.js'; 

export class DomainView {
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

    getLookup(name) {
        return this.lookups[name] || [];
    }

    Filtros() {
        const $container = $('#divFilterOptions').empty();
        const campos = this.info.Catalog.Bindings.filter(x => x.Lookup || x.LookupId);

        campos.forEach(c => {
            const filtroId = c.UiFilterKey.startsWith('#') ? c.UiFilterKey.substring(1) : c.UiFilterKey;
            const filtro   = Render.Select(filtroId, c.UiFilterTitle);
            $container.append(filtro);

            if (c.Lookup) {
                Render.Enum(c.UiFilterKey, c.Lookup);

            } else if (c.LookupId) {
                const list = this.getLookup(c.LookupId);
                list.forEach(row => {
                    const txt = row[c.DisplayId] || '---'; 
                    filtro.append($('<option>', { 
                        value: row.id || row.Id, 
                        text: txt 
                    }));
                });
            }
        });
    }

    Grid(container) {
        const $actions = $('<div>', { id: 'divDataActionButtons', class: 'mt-4 ms-2 divDataActionButtons d-flex justify-content-between align-items-center gap-3' }).append(
            $('<div>', { id: 'divDataActionButtons-left', class: 'action-buttons-left d-flex align-items-center gap-3' }).append(
                $('<button>', { id: 'btnAddNew', class: 'btn btn-primary' }).append(
                    $('<i>', { class: 'fas fa-plus' }), ' Incluir')
            ),
            $('<div>', { id: 'divDataActionButtons-right', class: 'action-buttons-right d-flex align-items-center gap-3' }).append(
                $('<button>', { class: 'btn btn-terciary', id: 'btnExport' }).append(
                    $('<i>', { class: 'fas fa-download' }), ' Exportar')
            ));

        const $table = $('<div>', { id: 'divdataTable', class: 'divdataTable mt-2 ms-2 table-responsive' }).append(
            $('<span>', { text: 'Dados' })
        );

        const $nav = $('<div>', { id: 'divPagination-section', class: 'pagination-section d-flex justify-content-between align-items-center' }).append(
            $('<div>', { id: 'divPagination-info', class: 'pagination-info' }).append(
                $('<span>', { id: 'navInfo', text: 'nav info' })
            ),
            $('<nav>').append(
                $('<ul>', { id: 'navControls', class: 'pagination mb-0' })
            ));

        const $section = $('<section>', { id: 'dataSection', class: 'data-section mx-2' })
            .append($actions, $table, $nav);

        container.append($section);
        
        this.Table($table);
    }

    Table(container) {
        const columns = this.info.Catalog.Bindings.filter(x => x.OnGrid);
        
        const thead   = columns.map(c => `<th>${c.UiFieldTitle}</th>`).join('');
        if (this.moduleKey === Modulo.Admin.Key) {
            thead.push('<th>Ações</th>');
        }
        const colSpan = columns.length;

        const $table  = $('<table>', { class: 'table table-striped table-hover' }).append(
            $('<thead>').append(thead),
            $('<tbody>', { id: 'dataRows' }).append(
                $('<tr>').append($('<td>', {
                    colspan: colSpan,
                    class: 'text-center text-muted', text: 'Carregando...'
                }))
            )
        );

        container.empty();
        container.append($table);
    }


    //
 
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
        const tbody   = $('#dataRows').empty();
        const rows    = response.data;

        const columns = this.info.Catalog.Bindings.filter(x => x.OnGrid);

        if (!rows.length) {
            tbody.append($('<tr>')
                 .append($('<td>', { colspan: columns.length + 1, text: 'Nenhum registro' })));
            return;
        }

        rows.forEach(dto => { 
            const $tr = $('<tr>');

            columns.forEach(c => {
                const value = this.resolveCellValue(dto, c);
                $tr.append($('<td>', { text: value })
                   .toggleClass('ellipsis25', c.DtoId === 'nome'));
            });

            if (this.moduleKey === Modulo.Admin.Key) {
                $tr.append(Render.AdminActions(dto.id));
            }

            tbody.append($tr);
        });

        Render.Info(response.pagination);
    }

    resolveCellValue(dto, campo) {
        if (campo.LookupId) {
            const  row = this.lookups[campo.LookupId]?.find(x => x.id === dto[campo.DtoId]);
            return row[campo.DisplayId] ?? '---';
        }

        if (campo.Lookup) {
            return campo.Lookup.ValueFromKey(dto[campo.DtoId]) ?? '';
        }

        return dto[campo.DtoId] ?? '';
    }

    //

    async view() {
        if (this.moduleKey === Modulo.Admin.Key) {
            await this.viewAdmin();
        }
    }

    async viewAdmin() {
        //this.Filters();
        //Render.Table(columns);

        //Render.ClearMain();
        //Render.FiltersFromCatalog(this.info);
        //Render.TableFromCatalog(this.info, this.moduleKey);

        const $pageBody = $('#page-body').empty();
        this.Filtros();
        this.Grid($pageBody);

        // AQUI...
    }    
}