import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Specific imports
import Keycloak from 'keycloak-js';
import { HasRolesDirective, KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from 'keycloak-angular';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterModule,
    HasRolesDirective,
    FormsModule,
    CommonModule
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  authenticated = false;
  keycloakStatus = false;
  showConfigForm = false;

  // Formulaire de profil
  form: any = {
    name: '',
    url: '',
    realm: '',
    clientId: '',
    clientSecret: '',
    scope: ''
  };

  selectedProfile = '';
  profileNames: string[] = [];

  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);

  constructor() {
    this.refreshProfileList();

    effect(() => {
      const keycloakEvent = this.keycloakSignal();

      if (typeEventArgs<ReadyArgs>(this.keycloakSignal().args) === undefined) {
        this.keycloakStatus = false;
      } else {
        this.keycloakStatus = true;
      }

      if (keycloakEvent.type === KeycloakEventType.Ready) {
        this.authenticated = typeEventArgs<ReadyArgs>(keycloakEvent.args);
        this.keycloakStatus = true;
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

  toggleConfigForm() {
    this.showConfigForm = !this.showConfigForm;
  }

  saveProfile() {
    if (!this.form.name) {
      alert('Nom du profil requis');
      return;
    }
    const profiles = this.getAllProfiles();
    profiles[this.form.name] = { ...this.form };
    this.setCookie('keycloak_profiles', JSON.stringify(profiles), 365);
    this.refreshProfileList();
    alert('Profil enregistré !');
    this.setCookie('selected_keycloak_profile', this.form.name, 365);

  }

  loadProfile() {
    const profiles = this.getAllProfiles();
    const data = profiles[this.selectedProfile];
    if (data) {
      this.form = { ...data };
      console.log('[Profil chargé]', data);
    }
  }

  deleteProfile() {
    const profiles = this.getAllProfiles();
    delete profiles[this.selectedProfile];
    this.setCookie('keycloak_profiles', JSON.stringify(profiles), 365);
    this.refreshProfileList();
    this.selectedProfile = '';
    alert('Profil supprimé');
  }

  refreshProfileList() {
    const profiles = this.getAllProfiles();
    this.profileNames = Object.keys(profiles);
  }

  getAllProfiles(): Record<string, any> {
    const cookie = this.getCookie('keycloak_profiles');
    return cookie ? JSON.parse(cookie) : {};
  }

  getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  setCookie(name: string, value: string, days: number) {
    const expires = new Date(Date.now() + days * 86400e3).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  }
}
