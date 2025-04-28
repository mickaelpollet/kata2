import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import Keycloak from 'keycloak-js';

import { PrettyJsonPipe } from '../../pipes/pretty-json.pipe'; // adapte le chemin

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
    PrettyJsonPipe
  ],
  templateUrl: './tokens.component.html',
  styleUrl: './tokens.component.scss'
})
export class TokensComponent {
  authenticated = false;
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  keycloakTokens: any = null;

  constructor() {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      this.keycloakTokens = this.keycloak;

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }
}
