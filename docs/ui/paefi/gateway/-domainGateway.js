// ui/paefi/gateway/domainGateway.js

export class DomainGateway {
    constructor({ api, lookups = {} }) {
        this.api = api;
        this.lookups = lookups;

        this.state = {
            page: 1,
            pageSize: 20,
            filters: {},
            lastData: null
        };
    }

    async activate() {
        this.wireEvents();
        await this.load();
    }

    async load() {
        throw new Error('load() not implemented');
    }

    wireEvents() { }
    dispose() { }
}
