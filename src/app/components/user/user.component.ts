import { Component, effect, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { ToastrService } from 'ngx-toastr';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from 'keycloak-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  authenticated = false;
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  currentUser = {
    email: '',
    email_verified: false,
    family_name: '',
    given_name: '',
    name: '',
    sub: '',
    preferred_username: '',
    groups: [] as string[],
    realmRoles: [] as string[],
    clientRoles: {} as { [clientName: string]: string[] }
  };

  constructor(private toastr: ToastrService) {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        const keycloakObject = this.keycloak.tokenParsed ?? {};

        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);

        this.currentUser.email = keycloakObject['email'] ?? '';
        this.currentUser.email_verified = keycloakObject['email_verified'] ?? false;
        this.currentUser.family_name = keycloakObject['family_name'] ?? '';
        this.currentUser.given_name = keycloakObject['given_name'] ?? '';
        this.currentUser.name = keycloakObject['name'] ?? '';
        this.currentUser.sub = keycloakObject['sub'] ?? '';
        this.currentUser.preferred_username = keycloakObject['preferred_username'] ?? '';
        this.currentUser.groups = Array.isArray(keycloakObject?.['groups'])
          ? keycloakObject['groups']
          : [];
        this.currentUser.realmRoles = Array.isArray(keycloakObject?.['realm_access']?.['roles'])
          ? keycloakObject['realm_access']['roles']
          : [];
        
        // Clients Roles
        const resourceAccess = keycloakObject?.['resource_access'];
        this.currentUser.clientRoles = {};

        if (resourceAccess && typeof resourceAccess === 'object') {
          for (const clientName of Object.keys(resourceAccess)) {
            const roles = resourceAccess[clientName]?.roles;
            if (Array.isArray(roles)) {
              this.currentUser.clientRoles[clientName] = roles;
            }
          }
        }
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }

  copyToClipboard(value: any): void {
    if (value !== null && value !== undefined) {
      const textarea = document.createElement('textarea');
      textarea.value = String(value);
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.toastr.success('Copied to clipboard!', 'Success');
    } else {
      this.toastr.error('Nothing to copy!', 'Error');
    }
  }
}