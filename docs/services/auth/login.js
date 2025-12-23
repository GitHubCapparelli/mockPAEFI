import { Session } from '../storage.js';

export const PerfisSIDS = Object.freeze({
  GESTOR         : 'gestor',
  EQUIPE         : 'equipe',
  ESPECIALISTA   : 'especialista',
  AGENTE_SOCIAL  : 'agenteSocial',
  DISEFI         : 'disefi',
  SUBSAS         : 'subsas',
  OUTRO          : 'outro'
});

export const RolesPAEFI = Object.freeze({
  CREAS_GESTOR        : 'CREAS_GESTOR',
  CREAS_EQUIPE        : 'CREAS_EQUIPE',
  CREAS_ESPECIALISTA  : 'CREAS_ESPECIALISTA',
  CREAS_AGENTE_SOCIAL : 'CREAS_AGENTE_SOCIAL',
  CPSM_DISEFI         : 'CPSM_DISEFI',
  SUBSAS_GERVIS       : 'SUBSAS_GERVIS',
  SEM_ACESSO          : 'SEM_ACESSO'
});

const PerfilRoleMap = {
  [PerfisSIDS.GESTOR]        : RolesPAEFI.CREAS_GESTOR,
  [PerfisSIDS.EQUIPE]        : RolesPAEFI.CREAS_EQUIPE,
  [PerfisSIDS.ESPECIALISTA]  : RolesPAEFI.CREAS_ESPECIALISTA,
  [PerfisSIDS.AGENTE_SOCIAL] : RolesPAEFI.CREAS_AGENTE_SOCIAL,
  [PerfisSIDS.DISEFI]        : RolesPAEFI.CPSM_DISEFI,
  [PerfisSIDS.SUBSAS]        : RolesPAEFI.SUBSAS_GERVIS,
  [PerfisSIDS.OUTRO]         : RolesPAEFI.SEM_ACESSO
};

export const Permissions = Object.freeze({
  PAEFI_VIEW          : 'PAEFI_VIEW',
  CASO_VIEW           : 'CASO_VIEW',
  CASO_CREATE         : 'CASO_CREATE',
  CASO_EDIT           : 'CASO_EDIT',
  SERVIDOR_VIEW       : 'SERVIDOR_VIEW',
  SERVIDOR_EDIT       : 'SERVIDOR_EDIT',
  VIEW_SENSITIVE_DATA : 'VIEW_SENSITIVE_DATA'
});

const RolePermissionsMap = {
  [RolesPAEFI.PAEFI_GESTOR]: [
    Permissions.PAEFI_VIEW,
    Permissions.CASO_VIEW,
    Permissions.CASO_CREATE,
    Permissions.CASO_EDIT,
    Permissions.SERVIDOR_VIEW
  ],

  [RolesPAEFI.PAEFI_EQUIPE]: [
    Permissions.PAEFI_VIEW,
    Permissions.CASO_VIEW,
    Permissions.CASO_CREATE
  ],

  [RolesPAEFI.PAEFI_ESPECIALISTA]: [
    Permissions.PAEFI_VIEW,
    Permissions.CASO_VIEW
  ],

  [RolesPAEFI.PAEFI_AGENTE_SOCIAL]: [
    Permissions.PAEFI_VIEW,
    Permissions.CASO_VIEW
  ],

  [RolesPAEFI.PAEFI_SUPERVISAO]: [
    Permissions.PAEFI_VIEW,
    Permissions.CASO_VIEW,
    Permissions.SERVIDOR_VIEW,
    Permissions.VIEW_SENSITIVE_DATA
  ]
};

function buildFakeUser(perfil) {
  return {
    id           : crypto.randomUUID(),
    nome         : 'Usuário Mock',
    perfil,
    role         : PerfilRoleMap[perfil] ?? RolesPAEFI.SEM_ACESSO,
    unidadeID    : '91185997-fc12-4326-ae3c-26094ca25477',
    isSystemUser : false
  };
}

export const AuthService = {
  EmulateLogin(perfilSelecionado) {
    const role = PerfilRoleMap[perfilSelecionado];

    if (!role || role === RolesPAEFI.SEM_ACESSO) {
      this.logout();
      return null;
    }

    const user        = buildFakeUser(perfilSelecionado);
    const permissions = RolePermissionsMap[role] || [];

    Session.Set('currentUser', {...user, permissions });
    return user;
  },

  GetCurrentUser() {
    return Session.Get('currentUser');
  },

  hasPermission(permission) {
    const user = this.GetCurrentUser();
    return user?.permissions?.includes(permission);
  },

  logout() {
    Session.Clear();
  }
};

