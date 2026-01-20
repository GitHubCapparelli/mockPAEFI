// ui paefi domain appGate

import { QueryEngine, CommandEngine }   from '../core/omClass.js';
import { Session, CurrentUserKey }      from '../../../services/storage.js';
import * as App                         from '../core/omData.js';

export class ApiGate {
    #query   = null;
    #command = null;

    constructor(info, fnRows, fnGetFilters) {
        this.info           = info;
        this.onLoaded_hook  = fnRows;
        this.onFilter_hook  = fnGetFilters;
        this.user           = Session.Get(CurrentUserKey);

        this.#query         = new QueryEngine(info.API);
        this.#command       = new CommandEngine(info.API);
    }

    async Read(filters = null) {
        const response = await this.#query.GetPaginated(filters);
        const result = this.#assureOnResponse(response);
        if (!result?.error) {
            this.onLoaded_hook(response);
        }
        return result;
    }

    async ReadPage(e, page) {
        const response = await this.#query.Navigate(e, page);
        const result = this.#assureOnResponse(response);
        if (!result?.error) {
            this.onLoaded_hook(response);
        }
        return result;
    }

    async Create(data) {
        const request   = this.#enforceOnRequest(data);
        if (request.error) return request;

        const response  = await this.#command.Create(request);
        const result    = this.#assureOnResponse(response);

        if (!result?.error) {
            await this.Read(this.onFilter_hook());
        }
        return result;
    }

    async Update(data, justificativa = null) {
        const request   = this.#enforceOnRequest(data, justificativa);
        if (request.error) return request;

        const response  = await this.#command.Update(request);
        const result    = this.#assureOnResponse(response);

        if (!result?.error) {
            await this.Read(this.onFilter_hook());
        }
        return result;
    }

    async Delete(id, data = null) {
        const request   = this.#enforceOnRequest(data ? { data } : { id })
        if (request.error) return request;

        const response  = await this.#command.Delete(request);
        const result    = this.#assureOnResponse(response);

        if (!result?.error) {
            await this.Read(this.onFilter_hook());
        }
        return result;
   }
    
    async Clear() {
        return await this.Read();
    }

    #getMetadata(justificativa = null) {
        const result = {
            catalogoID  : this.info.Catalogo.Key,
            tipo        : App.TipoLog.Frontend.Key
        };
        if (justificativa) {
            result.justificativa = justificativa;
        }
        return result;
    }


    #enforceOnRequest(data, justificativa = null) {
        let result   = {
            metadata : this.#getMetadata(justificativa),
            payload  : data 
        };
        return result;
    }

    #assureOnResponse(response) {
        if (!response)          return { error: 'Resposta vazia' };
        if (response.error)     return response;

        return { data: response };
    }
}