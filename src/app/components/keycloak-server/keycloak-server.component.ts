import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Specific modules
import Keycloak from 'keycloak-js';
import { ToastrService } from 'ngx-toastr';

import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';

@Component({
  selector: 'app-keycloak-server',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './keycloak-server.component.html',
  styleUrl: './keycloak-server.component.scss'
})
export class KeycloakServerComponent {
  authenticated = false;
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  keycloakServer = {
    scope: '',
    exp: '',
    iat: '',
    iss: '',
    azp: '',
    sid: '',
    acr: '',
    allowedOrigins: [] as string[]
  };

  constructor(private toastr: ToastrService) {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        const keycloakObject = this.keycloak.tokenParsed as any;
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);

        this.keycloakServer.scope = keycloakObject?.['scope'] ?? '';
        this.keycloakServer.exp = keycloakObject?.['exp']?.toString() ?? '';
        this.keycloakServer.iat = keycloakObject?.['iat']?.toString() ?? '';
        this.keycloakServer.iss = keycloakObject?.['iss'] ?? '';
        this.keycloakServer.azp = keycloakObject?.['azp'] ?? '';
        this.keycloakServer.sid = keycloakObject?.['sid'] ?? '';
        this.keycloakServer.acr = keycloakObject?.['acr'] ?? '';
        this.keycloakServer.allowedOrigins = Array.isArray(keycloakObject?.['allowed-origins'])
          ? keycloakObject['allowed-origins']
          : [];

        console.log('Keycloak Server Info:', this.keycloakServer);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }

  // Fonction moderne pour copier une valeur dans le presse-papier
  copyToClipboard(value: any): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value.toString()).then(() => {
        this.toastr.success('Copied to clipboard!', 'Success');
      }).catch(err => {
        console.error('Clipboard copy failed', err);
        this.toastr.error('Failed to copy!', 'Error');
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = value.toString();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.toastr.success('Copied to clipboard!', 'Success');
    }
  }
}