export * from './coreAPI.js';
export * from './unidadesAPI.js';
export * from './usuariosServidoresAPI.js';

export const AllAPIs = {
    async Init() {
        await Promise.all([
            UsuariosServidoresAPI.Init(),
            UnidadesAPI.Init()
        ]);
    }
};
