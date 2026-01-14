// ui paefi core modal 

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
        builder.renderFooter($footer, this.$cancel);

        $content.append($header, $body, $footer);
        $dialog.append($content);
        $modal.append($dialog);
        this.$root.append($modal);

        this.$modal = $modal;
        $modal.modal('show');
    }

    close() {
        this.$modal.modal('hide');
    }
}

export class ModalFormBuilder {

    constructor({ title, catalog, dto = null }) {
        this.title = title;
        this.catalog = catalog;
        this.dto = dto ?? {};
        this.original = structuredClone(this.dto);
        this.bindings = catalog.Bindings;
        this.controls = {};
    }

    /* Rendering */
    renderBody($container) {
        $container.empty();
        this.bindings.forEach(binding => {
            const $field = this.#renderField(binding);
            $container.append($field);
        });
    }

    #renderField(binding) {
        const $group = $('<div>', { class: 'mb-3' });

        const $label = $('<label>', {
            class: 'form-label',
            text: binding.UiFieldTitle
        });

        let $control;

        if (binding.Lookup) {
            $control = $('<select>', { class: 'form-select' });

            binding.Lookup.All.forEach(item => {
                $control.append(
                    $('<option>', {
                        value: item.Key,
                        text: item.Value
                    })
                );
            });

        } else {
            $control = $('<input>', {
                class: 'form-control',
                type: 'text'
            });
        }

        const value = this.dto[binding.DtoId];
        if (value !== undefined && value !== null) {
            $control.val(value);
        }

        this.controls[binding.DtoId] = $control;

        return $group.append($label, $control);
    }

    renderFooter($container, $btnCancel) {
        const $btnSave = $('<button>', { class: 'btn btn-primary', text: 'Salvar' });
        $container.append($btnCancel, $btnSave);
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
        $container.empty();
        const $message = $('<p>', { class: 'mb-0', text: this.message }));
        $container.append($message);
    }

    renderFooter($container, $btnCancel) {
        if (this.message.endsWith('?')) {
            const btnClass    = this.danger ? 'btn btn-danger' : 'btn btn-primary';
            const $btnConfirm = $('<button>', { class: btnClass, text: 'Confirmar' });
            $container.append($btnCancel, $btnConfirm);
        }
        else {
            $btnCancel.text('OK');
            $btnCancel.class('btn btn-primary');
            $container.append($btnCancel);
        }
    }

    /* Modal contract */
    async result() {
        return {
            action: 'confirm' 
        };
    }
}
