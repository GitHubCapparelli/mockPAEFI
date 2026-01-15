// ui paefi core modal

import { TipoAcesso, TipoCriptografia } from "./omData.js";

/* Modal shell ===== */
export class ModalShell {

    constructor(rootSelector = '#modal-root') {
        this.$root = $(rootSelector);
    }

    async open(builder) {
        this.#render(builder);

        return new Promise(resolve => {

            if (this.$confirm) {
                this.$confirm.on('click', async () => {
                    const result = await builder.result();
                    this.close();
                    resolve(result);
                });
            }

            this.$cancel.on('click', () => {
                this.close();
                resolve({ action: 'cancel' });
            });
        });
    }

    #render(builder) {
        this.$root.empty();

        const $modal   = $('<div>', { class: 'modal fade', tabindex: -1 });
        const $dialog  = $('<div>', { class: 'modal-dialog modal-lg' });
        const $content = $('<div>', { class: 'modal-content' });

        const $header  = $('<div>', { class: 'modal-header' }).append($('<h5>', { class: 'modal-title', text: builder.title }));
        const $body    = $('<div>', { class: 'modal-body' });
        builder.renderBody($body);

        const $footer  = $('<div>', { class: 'modal-footer' });
        this.$cancel   = $('<button>', { class: 'btn btn-secondary', text: 'Cancelar', 'data-bs-dismiss': 'modal' });
        this.$confirm  = builder.renderFooter($footer, this.$cancel);

        $content.append($header, $body, $footer);
        $dialog.append($content);
        $modal.append($dialog);
        this.$root.append($modal);

        this.$modal = $modal;
        $modal.modal({
            backdrop: 'static',
            keyboard: true
        });
        $modal.modal('show');
    }

    close() {
        if (this.$modal) {
            this.$modal.modal('hide');
        }
    }
}

/* Form builder ============ */
export class ModalFormBuilder {

    constructor({ title, catalog, lookups, dto = null }) {
        this.title      = title;
        this.catalog    = catalog;
        this.lookups    = lookups;
        this.dto        = dto ?? {};
        this.original   = structuredClone(this.dto);
        this.bindings   = catalog.Bindings;
        this.controls   = {};
    }
    static Create(prefix, info, lookups, dto = null) {
        return new ModalFormBuilder({
            title: `${prefix} ${info.Name}`,
            catalog: info.Catalog,
            lookups: lookups,
            dto: dto
        });
    }

    renderBody($container) {
        $container.empty();
        this.bindings.forEach(binding => { $container.append(this.#renderField(binding)); });

        Object.values(this.controls).forEach($el => {
            $el.on('input change', () => {
                this.$btnSave.prop('disabled', !(this.isValid() && this.isDirty()));
            });
        });
    }

    #getInfoFrom(binding) {
        const meta = [];
        const info = binding.DbInfo;

        if (info.Required) meta.push('obrigatório');

        if (info.MaxLength) {
            meta.push(info.MinLength === info.MaxLength
                        ? `${info.MaxLength}`
                        : `${info.MinLength}..${info.MaxLength}`
            );
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
        const $group    = $('<div>', { class: 'mb-3' });
        const $labelRow = $('<div>', { class: 'd-flex justify-content-between align-items-center' });

        const $label    = $('<label>', { class: 'form-label mb-1', text: binding.UiFieldTitle });
        $labelRow.append($label, this.#getInfoFrom(binding));

        let $control;
        if (binding.Lookup) {
            $control = $('<select>', { class: 'form-select' });
            binding.Lookup.All.forEach(item => {
                $control.append( $('<option>', { value: item.Key, text: item.Value }));
            });

        } else if (binding.LookupId) {
            $control = $('<select>', { class: 'form-select' });
            (this.lookups[binding.LookupId] || []).forEach(row => {
                $control.append(
                    $('<option>', {
                        value: row.id ?? row.Id,
                        text: row[binding.DisplayId] ?? '---'
                    })
                );
            });

        } else {
            $control = $('<input>', { class: 'form-control', type: 'text' });
        }

        const value = this.dto[binding.DtoId];
        if (value != null) $control.val(value);

        this.controls[binding.DtoId] = $control;
        return $group.append($labelRow, $control);
    }

    renderFooter($container, $btnCancel) {
        this.$btnSave = $('<button>', { class: 'btn btn-primary', text: 'Salvar', disabled: true });
        $container.append($btnCancel, this.$btnSave);
        return this.$btnSave;
    }

    collect() {
        return Object.fromEntries(
            Object.entries(this.controls).map(([k, $el]) => [k, $el.val() || null])
        );
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

    async result() {
        const dirty = this.diff();
        return {
            action: 'proceed',
            payload: Object.keys(this.original).length ? dirty : this.collect(),
            dirty
        };
    }
}

/* Message builder ========== */
export class ModalMessageBuilder {

    constructor({ title, message, danger = false }) {
        this.title   = title;
        this.message = message;
        this.danger  = danger;
    }
    static Create(title, message) {
        return new ModalMessageBuilder({ title: title, message: message });
    }

    renderBody($container) {
        $container.empty().addClass('d-flex align-items-center justify-content-center text-center');
        if (this.message.startsWith('<')) {
            const $msgBody = $('<div>', { id: 'msg-body', class: 'msg-body', html: this.message });
            $container.append($msgBody);
        } else {
            $container.append($('<p>', { class: 'mb-0 fs-5', text: this.message }));
        }
    }

    renderFooter($container, $btnCancel) {

        if (this.message.trim().includes('?')) {

            const $confirm = $('<button>', { class: this.danger ? 'btn btn-danger' : 'btn btn-primary', text: 'Confirmar' });
            $container.append($btnCancel, $confirm);
            return $confirm;
        }

        $btnCancel.text('OK').removeClass('btn-secondary').addClass('btn-primary');
        $container.append($btnCancel);
        return null;
    }

    async result() {
        return { action: 'proceed' };
    }
}


/* Justificativa builder     ======= */
export class ModalJustificativaBuilder {

    constructor(fieldNames) {
        this.fieldNames = fieldNames;
    }
    static Create(fieldNames) {
        return new ModalJustificativaBuilder(fieldNames);
    }

    renderBody($container) {
        $container.empty();
        const $group    = $('<div>', { class: 'mb-3' });
        const $labelRow = $('<div>', { class: 'd-flex justify-content-between align-items-center' });
        
        const $label    = $('<label>', { class: 'form-label mb-1', text: 'Justificativa' });
        $labelRow.append($label, this.fieldNames.join(' . '));

        const $control  = $('<input>', { id:'txtJustificativa', class: 'form-control', type: 'text-area' });

        $group.append($labelRow, $control);
        $container.append($group);

        $control.on('input change', (e) => {
            const isValid = $(e.currentTarget).val().length >= 10;
            this.$btnSave.prop('disabled', !isValid);
        });
    }

    renderFooter($container, $btnCancel) {
        this.$btnSave = $('<button>', { class: 'btn btn-primary', text: 'Salvar', disabled: true });
        $container.append($btnCancel, this.$btnSave);
        return this.$btnSave;
    }

    async result() {
        return {
            action        : 'proceed',
            justificativa : $('#txtJustificativa').val()
        };
    }
}
