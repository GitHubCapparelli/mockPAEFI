// ui paefi core modal 

import { TipoAcesso, TipoCriptografia } from "./omData";
import * as Enum from './omEnum.js';

export class ModalShell {
    constructor(rootSelector = '#modal-root') {
        this.$root = $(rootSelector);
    }

    async open(builder) {
        this.#render(builder);

        return new Promise(resolve => {
            this.$confirm.on('click', async () => {
                const result = await builder.result();
                this.close();
                resolve(result);
            });

            this.$cancel.on('click', () => {
                this.close();
                resolve({ action: 'cancel' });
            });
        });
    }

    #render(builder) {
        this.$root.empty();

        this.$cancel   = $('<button>', { class: 'btn btn-secondary', text: 'Cancelar',
            'data-bs-dismiss': 'modal' });

        const $modal   = $('<div>', { class: 'modal fade', tabindex: -1 });
        const $dialog  = $('<div>', { class: 'modal-dialog modal-lg' });
        const $content = $('<div>', { class: 'modal-content' });

        const $header  = $('<div>', { class: 'modal-header' })
            .append($('<h5>', { class: 'modal-title', text: builder.title }));

        const $body    = $('<div>', { class: 'modal-body' });
        builder.renderBody($body);

        const $footer  = $('<div>', { class: 'modal-footer' });
        this.$confirm = builder.renderFooter($footer, this.$cancel);

        $content.append($header, $body, $footer);
        $dialog.append($content);
        $modal.append($dialog);
        this.$root.append($modal);

        this.$modal = $modal;
        $modal.modal({ backdrop: 'static' }); //, keyboard: false });
        $modal.modal('show');
    }

    close() {
        this.$modal.modal('hide');
    }
}

export class ModalFormBuilder {

    constructor({ title, catalog, lookups, dto = null }) {
        this.title      = title;
        this.catalog    = catalog;
        this.dto        = dto ?? {};
        this.original   = structuredClone(this.dto);
        this.bindings   = catalog.Bindings;
        this.lookups    = lookups;
        this.controls   = {};
    }

    /* Rendering */
    renderBody($container) {
        $container.empty();
        this.bindings.forEach(binding => {
            const $field = this.#renderField(binding);
            $container.append($field);
        });

        Object.values(this.controls).forEach($el => {
            $el.on('input change', () => {
                this.$btnSave.prop('disabled', !(this.isValid() && this.isDirty()));
            });
        });
    }

    #getInfoFrom(binding) {
        const meta = [];
        const info = binding.DbInfo;

        if (info.Required)  meta.push('obrigatório');
        if (info.MaxLength) {
            if (info.MaxLength === info.MinLength) {
                meta.push(`[${info.MaxLength}]`);
            } else {
                meta.push(`[${info.MinLength}-${info.MaxLength}]`);
            }
        }
        if (info.Cripto !== TipoCriptografia.Nenhuma.Key) {
            meta.push(`Proteção: ${info.Cripto}`);
        }
        if (info.Access !== TipoAcesso.Interno.Key) {
            meta.push(`Acesso ${info.Access}`);
        }
        return $('<small>', { class: 'text-muted', text: meta.join(' · ') });
    }

    #renderField(binding) {
        const $group = $('<div>',   { class: 'mb-3' });

        const $labelRow = $('<div>', { class: 'd-flex justify-content-between align-items-center' });
        const $label    = $('<label>', { class: 'form-label mb-1', text: binding.UiFieldTitle });
        const $meta     = this.#getInfoFrom(binding);
        $labelRow.append($label, $meta);

        let $control;
        if (binding.Lookup) {
            $control = $('<select>', { class: 'form-select' });

            binding.Lookup.All.forEach(item => {
                $control.append( $('<option>', { value: item.Key, text: item.Value }));
            });

        } else if (binding.LookupId) {
            $control = $('<select>', { class: 'form-select' });
            const list = this.lookups[binding.LookupId] || [];
            list.forEach(row => {
                const txt = row[c.DisplayId] || '---';
                $control.append($('<option>', { value: row.id || row.Id, text: txt }));
            });
        } else {
            $control = $('<input>', { class: 'form-control', type: 'text' });
        }

        const value = this.dto[binding.DtoId];
        if (value !== undefined && value !== null) { $control.val(value);}

        this.controls[binding.DtoId] = $control;
        return $group.append($labelRow, $control);
    }

    renderFooter($container, $btnCancel) {
        this.$btnSave = $('<button>', { class: 'btn btn-primary', text: 'Salvar', disabled: true });
        $container.append($btnCancel, this.$btnSave);
        return this.$btnSave;
    }


    /* Data collection & diff */
    collect() {
        return Object.entries(this.controls).reduce((acc, [key, $el]) => {
            acc[key] = $el.val() || null;
            return acc;
        }, {});
    }

    diff() {
        const current = this.collect();
        const dirty = {};

        for (const key in current) {
            if (!this.#equals(current[key], this.original[key])) {
                dirty[key] = current[key];
            }
        }
        return dirty;
    }

    #equals(a, b) {
        if (a == null && b == null) return true;
        return String(a).trim() === String(b).trim();
    }

    isDirty() {
        return Object.keys(this.diff()).length > 0;
    }

    isValid() {
        return this.bindings.every(b => {
            if (!b.Required) return true;
            const val = this.controls[b.DtoId]?.val();
            return val !== null && val !== '';
        });
    }

    /* Modal contract */
    async result() {
        const dirty = this.diff();

        return {
            action: 'save',
            payload: Object.keys(this.original).length ? dirty : this.collect(),
            dirty
        };
    }
}

export class ModalMessageBuilder {

    constructor({ title, message, danger = false }) {
        this.title      = title;
        this.message    = message;
        this.danger     = danger;
    }

    renderBody($container) {
        $container.empty().addClass('d-flex align-items-center justify-content-center text-center');
        const $message = $('<p>', { class: 'mb-0 fs-5', text: this.message });
        $container.append($message);
    }

    renderFooter($container, $btnCancel) {
        if (this.message.endsWith('?')) {
            const btnClass    = this.danger ? 'btn btn-danger' : 'btn btn-primary';
            const $btnConfirm = $('<button>', { class: btnClass, text: 'Confirmar' });
            $container.append($btnCancel, $btnConfirm);
            return $btnConfirm;
        }
        else {
            $btnCancel.text('OK');
            $btnCancel.attr('class', 'btn btn-primary');
            $container.append($btnCancel);
            return null;
        }
    }

    /* Modal contract */
    async result() {
        return {
            action: 'confirm' 
        };
    }
}
