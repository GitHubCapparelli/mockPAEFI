// ui paefi gateway usuariosServidoresGateway.js

import { DomainGateway }                              from './domainGateway.js';
import { UsuariosServidoresAPI }                      from '../../../services/api/usuariosServidoresAPI.js';
import { UnidadesAPI }                                from '../../../services/api/unidadesAPI.js';
import { FuncaoUsuario, CargoUsuario, Especialidade } from '../../../objModel.js';
import { QueryEngine }                                from '../engine/queryEngine.js';
import { CoreAdmin }                                  from './coreAdmin.js';

/* =========================================================
   Table definition

  /* -------------------------------------------------------
     Lifecycle
  ------------------------------------------------------- */

  async activate() {
    await this.loadLookups();

    this.renderFilters();
    this.hydrateFilters();
    this.renderPagination();

    CoreAdmin.BuildTable(columns);

    this.wireEvents();
    await this.load();
  }

  /* -------------------------------------------------------
     Data
  ------------------------------------------------------- */

  async loadLookups() {
    await this.lookups.unidades.Init();
    this.unidades = this.lookups.unidades.GetAll();
  }

  async load() {
    const result = await this.query.execute();

    this.render(result.data);

    await this.query.execute();
    this.updatePaginationInfo(this.query.state);
  }

  /* -------------------------------------------------------
     Rendering – Filters
  ------------------------------------------------------- */

  renderFilters() {
    const $container = $('#divFilterOptions').empty();

    $container.append(
      this.buildSelect('cmbFilterUnidade', 'Todas as Unidades'),
      this.buildSelect('cmbFilterEspecialidade', 'Todas as Especialidades'),
      this.buildSelect('cmbFilterFuncao', 'Todas as Funções'),
      this.buildSelect('cmbFilterCargo', 'Todos os Cargos')
    );
  }

  hydrateFilters() {
    const $unidades = $('#cmbFilterUnidade');

    this.unidades.forEach(u =>
      $unidades.append(
        $('<option>', { value: u.id, text: u.sigla })
      )
    );

    this.fillEnum('#cmbFilterEspecialidade', Especialidade);
    this.fillEnum('#cmbFilterFuncao',        FuncaoUsuario);
    this.fillEnum('#cmbFilterCargo',         CargoUsuario);
  }

  buildSelect(id, placeholder) {
    return $('<select>', {
      id,
      class: 'form-select form-select-sm'
    }).append(
      $('<option>', { value: '', text: placeholder })
    );
  }

  fillEnum(selector, enumType) {
    const $select = $(selector);

    enumType.All.forEach(e =>
      $select.append(
        $('<option>', { value: e.Key, text: e.Value })
      )
    );
  }

  /* -------------------------------------------------------
     Rendering – Table
  ------------------------------------------------------- */

  render(list) {
    const $tbody = $('#dataRows').empty();

    if (!list || !list.length) {
      $tbody.append(
        $('<tr>').append(
          $('<td>', {
            colspan: 6,
            class: 'text-center text-muted',
            text: 'Nenhum registro'
          })
        )
      );
      return;
    }

    list.forEach(u => {
      const unidade = this.unidades.find(x => x.id === u.unidadeID);
      $tbody.append(this.buildRow(u, unidade));
    });
  }

  buildRow(u, unidade) {
    return $('<tr>').append(
      $('<td>').text(u.nome),
      $('<td>').text(unidade?.sigla || ''),
      $('<td>').text(Especialidade.ValueFromKey(u.especialidade) || ''),
      $('<td>').text(FuncaoUsuario.ValueFromKey(u.funcao) || ''),
      $('<td>').text(CargoUsuario.ValueFromKey(u.cargo) || ''),
      $('<td>').append(
        $('<button>', {
          class: 'btn btn-sm btn-primary js-edit',
          'data-id': u.id
        }).append(
          $('<i>', { class: 'fas fa-edit' })
        )
      )
    );
  }

  /* -------------------------------------------------------
     Pagination
  ------------------------------------------------------- */

  renderPagination() {
    const $container = $('#divPagination').empty();

    $container.append(
      $('<nav>').append(
        $('<ul>', { class: 'pagination pagination-sm mb-0' }).append(
          $('<li>', { class: 'page-item' }).append(
            $('<a>', {
              href: '#',
              class: 'page-link',
              'data-page': 'prev',
              text: '«'
            })
          ),
          $('<li>', { class: 'page-item disabled' }).append(
            $('<span>', {
              id: 'lblPaginationInfo',
              class: 'page-link'
            })
          ),
          $('<li>', { class: 'page-item' }).append(
            $('<a>', {
              href: '#',
              class: 'page-link',
              'data-page': 'next',
              text: '»'
            })
          )
        )
      )
    );
  }

  updatePaginationInfo({ page, totalPages, totalRecords }) {
    $('#lblPaginationInfo').text(
      `Página ${page} de ${totalPages} (${totalRecords} registros)`
    );
  }

  /* -------------------------------------------------------
     Events
  ------------------------------------------------------- */

  wireEvents() {

    $('#btnApplyFilter').on('click', async () => {
      this.query.setFilters({
        unidadeID:       $('#cmbFilterUnidade').val() || null,
        especialidade:   $('#cmbFilterEspecialidade').val() || null,
        funcao:          $('#cmbFilterFuncao').val() || null,
        cargo:           $('#cmbFilterCargo').val() || null
      });

      this.query.resetPage();
      await this.load();
    });

    $('#btnClearFilter').on('click', async () => {
      $('.filters-bar select').val('');
      this.query.clearFilters();
      this.query.resetPage();
      await this.load();
    });

    $('#divPagination').on('click', 'a[data-page]', async e => {
      e.preventDefault();

      const action = $(e.currentTarget).data('page');
      if (action === 'prev') this.query.prevPage();
      if (action === 'next') this.query.nextPage();

      await this.load();
    });
  }
}
