import { UserRole } from '@modules/users'
import {
  PermissionConsulterProjet,
  PermissionInvaliderGF,
  PermissionListerProjets,
  PermissionValiderGF,
  PermissionAnnulerGF,
  PermissionAjouterDateExpirationGF,
  PermissionUploaderGF,
  PermissionRetirerGF,
} from '@modules/project'
import { PermissionInviterDgecValidateur } from '@modules/utilisateur'

export type Permission = {
  nom: string
  description: string
}

export const PermissionListerDemandesAdmin = {
  nom: 'lister-demandes',
  description: 'Lister les demandes de modification',
}

export const getPermissions = ({ role }: { role: UserRole }): Array<Permission> => {
  switch (role) {
    case 'dreal':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionValiderGF,
        PermissionInvaliderGF,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionListerDemandesAdmin,
      ]
    case 'porteur-projet':
    case 'caisse-des-dépôts':
      return [
        PermissionListerProjets,
        PermissionConsulterProjet,
        PermissionAnnulerGF,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
      ]
    case 'admin':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
        PermissionInviterDgecValidateur,
      ]
    case 'dgec-validateur':
      return [
        PermissionListerProjets,
        PermissionListerDemandesAdmin,
        PermissionConsulterProjet,
        PermissionAjouterDateExpirationGF,
        PermissionUploaderGF,
        PermissionRetirerGF,
      ]
    case 'acheteur-obligé':
    case 'ademe':
    case 'cre':
      return [PermissionListerProjets, PermissionConsulterProjet]
    default:
      return []
  }
}
