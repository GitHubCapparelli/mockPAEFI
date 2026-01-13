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

    assureCleanDivContainer(divID, parentID) {
        let $div = $(divID);
        if ($div.length === 0) {
            const name = divID.substring(1);
            $div = $('<div>', { id: name, class: name });
            $(parentID).append($div);
        } else {
            $div.empty();
        }
        return $div;
    }

    Filtros() {
        const $divFiltros = this.assureCleanDivContainer('#divFilterOptions', '#page-body');
        const campos      = this.info.Catalog.Bindings.filter(x => x.Lookup || x.LookupId);

        campos.forEach(c => {
            const filtroId = c.UiFilterKey.startsWith('#') ? c.UiFilterKey.substring(1) : c.UiFilterKey;
            const filtro   = Render.Select(filtroId, c.UiFilterTitle);
            $divFiltros.append(filtro);

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

    Grid() {
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

        $('#page-body').append($section);
        
        this.Table();
    }

    Table() {
        const columns = this.info.Catalog.Bindings.filter(x => x.OnGrid);
        const header  = columns.map(c => `<th>${c.UiFieldTitle}</th>`);
        if (this.moduleKey === Modulo.Admin.Key) {
            header.push('<th>Ações</th>');
        }

        const $table  = $('<table>', { class: 'table table-striped table-hover' }).append(
            $('<thead>').append(header.join('')),
            $('<tbody>', { id: 'dataRows' }).append(
                $('<tr>').append($('<td>', {
                    colspan: header.length,
                    class: 'text-center text-muted', text: 'Carregando...'
                }))
            )
        );

        const $div = $('#divdataTable').empty();
        $div.append($table);
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
                const val = this.resolveCellValue(dto, c);
                $('<td>', { text: val })
                    .toggleClass('ellipsis25', c.DtoId === 'nome')
                    .appendTo($tr);
            });

            if (this.moduleKey === Modulo.Admin.Key) {
                const actions = this.actionsButtonsCell(dto.id);
                $tr.append(actions);
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

    actionsButtonsCell(id) {
        const $td = $('<td>', { class: 'd-flex gap-1' });
        $td.append(
            $('<button>', { class: 'btn btn-sm btn-primary js-edit', 'data-id': id, title: 'Editar' })
                .append($('<i>', { class: 'fas fa-edit' }))
        );
        $td.append(
            $('<button>', { class: 'btn btn-sm btn-danger js-delete', 'data-id': id, title: 'Deletar' })
                .append($('<i>', { class: 'fas fa-trash' }))
        );
        return $td;
    }
    
    //

    async view() {
        if (this.moduleKey === Modulo.Admin.Key) {
            await this.viewAdmin();
        }
    }

    async viewAdmin() {
        this.Filtros();
        this.Grid();
    }    
}