import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import Keycloak from 'keycloak-js';

import { TokensComponent } from '../tokens/tokens.component';
import { UserComponent } from '../user/user.component';
import { KeycloakServerComponent } from '../keycloak-server/keycloak-server.component';

import {
  KEYCLOAK_EVENT_SIGNAL,
  KeycloakEventType,
  typeEventArgs,
  ReadyArgs
} from 'keycloak-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    UserComponent,
    KeycloakServerComponent,
    TokensComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
  authenticated = false;
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  keycloakObject: any = null;

  constructor() {
    effect(() => {
      const keycloakEvent = this.keycloakSignal();
      this.keycloakObject = this.keycloak;

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }
}