//ui.paefi.domain.usuariosServidores.js

import { Render } from '../core/renderer.js';
import { QueryEngine } from '../core/omClass.js';
import { UnidadesAPI } from '../../../services/api/unidadesAPI.js';
import { UsuariosServidoresAPI } from '../../../services/api/usuariosServidoresAPI.js';
import {
  FuncaoUsuario, CargoUsuario, Especialidade,
  Dominio, Modulo
} from '../core/omEnum.js';

const columns = [
  { label: 'Nome', field: 'nome' },
  { label: 'Unidade', field: 'unidade' },
  { label: 'Especialidade', field: 'especialidade' },
  { label: 'Função', field: 'funcao' },
  { label: 'Cargo', field: 'cargo' },
  { label: 'Ações', field: 'acoes' }
];

export class UsuariosServidoresDomain {

  constructor(modulo) {
    this.modulo = modulo;
    this.api = UsuariosServidoresAPI;
    this.unidades = [];
    this.render = new Renderer();
    this.query = new QueryEngine(this.api, this.render, this.refresh);
    this.Init();
  }

  async Init() {
    await Promise.all([
      UnidadesAPI.Init(),
      UsuariosServidoresAPI.Init()
    ]);

    if (this.modulo.Key === Modulo.Admin.Key) {
      await this.viewAdmin();
    }
  }

  async viewAdmin() {
    this.render.Filters();
    Render.BuildTable(columns);

    this.wireEvents();
    await this.query.loadData();

    this.unidades = UnidadesAPI.GetAll();
    this.render.FiltersItems(this.unidades);
  }

  refresh(response) {
    this.render.Rows(response.data, this.unidades);
    this.render.Info(response.pagination);
  }

  getFilters() {
    return {
      unidadeID: $('#cmbFilterUnidade').val() || null,
      especialidade: $('#cmbFilterEspecialidade').val() || null,
      funcao: $('#cmbFilterFuncao').val() || null,
      cargo: $('#cmbFilterCargo').val() || null
    };
  }

  wireEvents() {
    $('#btnApplyFilter').on('click', async () => {
      const filters = this.getFilters();
      this.query.Apply(filters);
    });

    $('#btnClearFilter').on('click', async () => {
      $('.filters-bar select').val('');
      this.query.Clear();
    });

    $('#navControls').on('click', 'a.page-link', async e => {
      this.query.Navigate(e, $(this).data('page'));
    });
  }
}

class Renderer {
  Filters() {
    const $container = $('#divFilterOptions').empty();

    $container.append(
      this.List('cmbFilterUnidade', 'Todas as Unidades'),
      this.List('cmbFilterEspecialidade', 'Todas as Especialidades'),
      this.List('cmbFilterFuncao', 'Todas as Funções'),
      this.List('cmbFilterCargo', 'Todos os Cargos')
    );
  }

  FiltersItems(unidades) {
    const $unidades = $('#cmbFilterUnidade');
    unidades.forEach(u =>
      $unidades.append(
        $('<option>', { value: u.id, text: u.sigla })
      )
    );
    this.Enum('#cmbFilterEspecialidade', Especialidade);
    this.Enum('#cmbFilterFuncao', FuncaoUsuario);
    this.Enum('#cmbFilterCargo', CargoUsuario);
  }

  List(id, placeholder) {
    return $('<select>', {
      id,
      class: 'form-select form-select-sm'
    }).append(
      $('<option>', { value: '', text: placeholder })
    );
  }

  Enum(selector, enumType) {
    const $select = $(selector);
    enumType.All.forEach(e =>
      $select.append(
        $('<option>', { value: e.Key, text: e.Value })
      )
    );
  }

  Rows(list, unidades) {
    const tbody = $('#dataRows').empty();
    if (!list.length) {
      tbody.append(`<tr><td colspan="${columns.length}">Nenhum registro</td></tr>`);
      return;
    }

    list.forEach(u => {
      let sigla = 'Xiii!';
      if (unidades) {
        const unidade = unidades.find(un => un.id === u.unidadeID);
        sigla = unidade ? unidade.sigla : 'ooops';
      }
      tbody.append(`<tr>
          <td title="${u.nome}">${u.nome}</td>
          <td>${sigla}</td>
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
  }

  Info(p) {
    const start = (p.page - 1) * p.pageSize + 1;
    const end = Math.min(start + p.pageSize - 1, p.totalRecords);
    const prevDisabled = p.page === 1 ? 'disabled' : '';
    const nextDisabled = p.page === p.totalPages ? 'disabled' : '';

    const $navInfo = $('#navInfo');
    $navInfo.text(`Mostrando ${start} - ${end} de ${p.totalRecords} registros`);

    const $ul = $('#navControls').empty();
    $ul.append(`
      <li class="page-item ${prevDisabled}">
        <a class="page-link" href="#" data-page="${p.page - 1}">Anterior</a>
      </li>
    `);

    for (let i = 1; i <= p.totalPages; i++) {
      const active = i === p.page ? 'active' : '';
      $ul.append(`
        <li class="page-item ${active}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `);
    }

    $ul.append(`
      <li class="page-item ${nextDisabled}">
        <a class="page-link" href="#" data-page="${p.page + 1}">Próxima</a>
      </li>
    `);
  }
}