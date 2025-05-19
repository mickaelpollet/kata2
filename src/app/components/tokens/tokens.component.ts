import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import Keycloak from 'keycloak-js';

import { PrettyJsonPipe } from '../../pipes/pretty-json.pipe';
import { ToastrService } from 'ngx-toastr';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [
    CommonModule,
    PrettyJsonPipe,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './tokens.component.html',
  styleUrl: './tokens.component.scss'
})
export class TokensComponent {
  authenticated = false;
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  keycloakTokens: any = null;
  keycloakGlobalToken: any = null;

  constructor(private toastr: ToastrService) {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      this.keycloakTokens = this.keycloak;
      this.keycloakGlobalToken = JSON.stringify(this.keycloak);

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }

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
