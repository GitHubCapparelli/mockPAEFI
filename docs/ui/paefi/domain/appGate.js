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
        const request  = this.#enforceOnRequest(data, 'create');
        if (request.error) {
            return request;
        }
        const response = await this.#command.Create(request);
        const result   = this.#assureOnResponse(response);
        if (!result?.error) {
            await this.Read(this.onFilter_hook());
        }
        return result;
    }

    async Update(id, data, justificativa = null) {
        const request  = this.#enforceOnRequest(data, 'update', justificativa);
        const response = await this.#command.Update(id, request);
        
        const result   = this.#assureOnResponse(response);
        if (!result?.error) {
            await this.Read(this.onFilter_hook());
        }
        return result;
    }

    async Delete(id, data = null) {
        const request  = this.#enforceOnRequest(data, 'delete')
        const response = (data) 
                       ? await this.#command.SoftDelete(id, request)
                       : await this.#command.Delete(id);

        const result = this.#assureOnResponse(response);
        if (!result?.error) {
            await this.Read(this.onFilter_hook());
        }
        return result;
   }
    
    async Clear() {
        return await this.Read();
    }

    #getMetadata(acao, justificativa = null) {
        const result  = {
            userID    : this.user.id,
            catalogID : this.info.Catalog.Key,
            tipo      : App.TipoLog.Frontend.Key,
            acao      : acao
        }
        if (justificativa) {
            result.justificativa = justificativa;
        }
    }

    #enforceOnRequest(data, acao, justificativa = null) {
        let result   = {
            metadata : this.#getMetadata(acao, justificativa),
            payload  : this.#enrich(data, acao)
        };

        if (this.info.Catalog.Key === App.Catalog.UsuariosServidores.Key) {
            // validate data (result.payload) ...
            // data can be null [only on (hard)deletion (acao === 'delete')...]
        }
        //return result; // or something else... (null?, an error?, {}? ) like..
        
        result.error = 'Not implemented (yet)...';
        return result;
    }

    #enrich(data, acao) {
        if (acao == 'create') {
            data.criadoEm = new Date().toISOString();
            data.criadoPor = this.user.id;
        } else if (acao == 'update') {
            data.alteradoEm = new Date().toISOString();
            data.alteradoPor = this.user.id;
        } else if (acao == 'delete') {
            data.excluidoEm = new Date().toISOString();
            data.excluidoPor = this.user.id;
        } else {
            throw new Error(`Ação não implementada: ${acao}`)
        }
        return data;
    }

    #assureOnResponse(response) {
        // validate response [always a DTO, or a bunch of them, or an error. ]
        // Right ? If so, validates schema when DTO(s)...
    }

}