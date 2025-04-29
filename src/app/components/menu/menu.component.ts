import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';


// Specific imports
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from 'keycloak-angular';
import { ProfileManagerComponent } from '../profile-manager/profile-manager.component';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  authenticated = false;
  keycloakStatus = false;
  private readonly dialog = inject(MatDialog);

  selectedProfile = '';
  profileNames: string[] = [];

  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor() {

    effect(() => {
      const keycloakEvent = this.keycloakSignal();

      if (typeEventArgs<ReadyArgs>(this.keycloakSignal().args) === undefined) {
        this.keycloakStatus = false;
      } else {
        this.keycloakStatus = true;
      }

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
      }

      if (keycloakEvent.type === KeycloakEventType.AuthLogout) {
        this.authenticated = false;
      }
    });
  }

  login() {
    this.keycloak.login();
  }

  logout() {
    this.keycloak.logout();
  }

  openProfileModal() {
    this.dialog.open(ProfileManagerComponent, {
      width: '600px',
      disableClose: true
    });
  }
}
