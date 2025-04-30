import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Specific modules
import { ToastrService } from 'ngx-toastr';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from 'keycloak-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  authenticated = false;
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  standardKeys = [
    'exp', 'iat', 'auth_time', 'jti', 'iss', 'aud', 'sub', 'typ', 'azp', 'sid', 'acr',
    'allowed-origins', 'realm_access', 'resource_access', 'scope',
    'email_verified', 'name', 'groups', 'preferred_username',
    'given_name', 'family_name', 'email'
  ];

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
    clientRoles: {} as { [clientName: string]: string[] },
  };

  attributes: { key: string, value: string | string[] }[] = [];

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

        this.attributes = [];
        for (const [key, value] of Object.entries(keycloakObject)) {
          if (!this.standardKeys.includes(key)) {
            this.attributes.push({ key, value });
          }
        }

        this.authenticated = true;
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }

  copyToClipboard(value: any): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value.toString()).then(() => {
        this.toastr.success('Copied to clipboard !', 'Success');
      }).catch(err => {
        console.error('Clipboard copy failed', err);
        this.toastr.error('Failed to copy! ', 'Error');
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = value.toString();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.toastr.success('Copied to clipboard ! ', 'Success');
    }
  }

  getObjectKeys(obj: object | undefined): string[] {
    return obj ? Object.keys(obj) : [];
  }

  isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value);
  }
}