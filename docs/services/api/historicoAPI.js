import { CoreAPI }          from './coreAPI.js';
import { HistoricoDTO }     from '../../data/factory/historicoDTO.js';

export const HistoricoAPI = CoreAPI({
    entity          : 'historico',
    dataPath        : '/mockPAEFI/data/mock/historico.json',
    jsonRoot        : 'historico',
    defaultOrderBy  : 'dataHora',
    DTO             : HistoricoDTO,

    applyFilters(data, filters) {
        let result = data;
        if (filters) {
            if (filters.userID) {
                result = result.filter(u => u.userID === filters.userID);
            }
            if (filters.catalogoID) {
                result = result.filter(u => u.catalogoID === filters.catalogoID);
            }
            if (filters.dataHora) {
                result = result.filter(u => u.dataHora === filters.dataHora);
            }
            if (filters.tipo) {
                result = result.filter(u => u.tipo === filters.tipo);
            }
            if (filters.acao) {
                result = result.filter(u => u.acao === filters.acao);
            }
        }
        return result;
    },

    validateCreate(dto, data) {
        if (!dto.userID || !dto.catalogoID || !dto.sessionId || !dto.dataHora || !dto.tipo || !dto.acao || !dto.diff) {
            throw new Error('Campos obrigatórios ausentes.');
        }
    }
});
