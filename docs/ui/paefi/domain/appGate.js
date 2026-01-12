// ui paefi domain appGate

import { QueryEngine, CommandEngine, Modal }  from '../core/omClass.js';
import { DomainInfo }                         from '../core/omData.js';

export class ApiGate {
    constructor(info, fnRows, fnGetFilters) {
        this.query      = new QueryEngine(info.API, fnRows);
        this.command    = new CommandEngine(info.API, () => this.query.loadData(fnGetFilters()));
    }

    async Create(data) {  
        await this.command.Create(data);
    }

    async Read(filters = null) {
        await this.query.GetPaginated(filters);
    }

    async ReadPage(e, page) {
        await this.query.Navigate(e, page);
    }

    async Update(id, data) {
        await this.command.Update(id, data);
    }

    async Delete(id, data = null) {
        if (data) {
            await this.command.SoftDelete(id, data);
        }
        else {
            await this.command.Delete(id);
        }
    }

    async Load() {
        await this.query.loadData();
    }
    
    async Clear() {
        await this.query.Clear();
    }

}