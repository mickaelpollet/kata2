import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface KeycloakProfile {
  name: string;
  url: string;
  realm: string;
  clientId: string;
  clientSecret: string;
  scope: string;
}

@Component({
  selector: 'app-profile-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.scss']
})
export class ProfileManagerComponent implements OnInit {

  profileForm: FormGroup;
  profiles: KeycloakProfile[] = [];
  selectedProfile = '';
  profileNames: string[] = [];

  constructor(
    private cookieService: CookieService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.fb.group({
      name: [''],
      url: [''],
      realm: [''],
      clientId: [''],
      clientSecret: [''],
      scope: ['']
    });
  }

  ngOnInit(): void {
    this.loadProfiles();
    const activeProfileName = this.cookieService.get('keycloak-profile-selected');
    if (activeProfileName) {
      this.selectedProfile = activeProfileName;
      this.loadProfileToForm(activeProfileName);
    }
  }

  loadProfiles(): void {
    const cookie = this.cookieService.get('keycloak-profiles');
    this.profiles = cookie ? JSON.parse(cookie) : [];
    this.profileNames = this.profiles.map(p => p.name);
  }

  loadProfileToForm(name: string): void {
    const profile = this.profiles.find(p => p.name === name);
    if (profile) {
      this.profileForm.patchValue(profile);
    }
  }

  onProfileSelect(): void {
    this.loadProfileToForm(this.selectedProfile);
  }

  saveProfile(): void {
    const profile: KeycloakProfile = this.profileForm.value;
    const index = this.profiles.findIndex(p => p.name === profile.name);
    if (index >= 0) {
      this.profiles[index] = { ...profile };
    } else {
      this.profiles.push({ ...profile });
    }
    this.saveProfiles();
    this.loadProfiles();
  }

  deleteProfile(): void {
    const name = this.profileForm.value.name;
    this.profiles = this.profiles.filter(p => p.name !== name);
    this.saveProfiles();
    this.selectedProfile = '';
    this.profileForm.reset();
    this.loadProfiles();
  }

  copyProfile(): void {
    const profile = this.profileForm.value;
    const copy = { ...profile, name: `${profile.name}_copy` };
    this.profileForm.patchValue(copy);
  }

  loadProfile(): void {
    const name = this.profileForm.value.name;
    this.cookieService.set('keycloak-profile-selected', name, { path: '/' });
    window.location.reload();
  }

  private saveProfiles(): void {
    this.cookieService.set('keycloak-profiles', JSON.stringify(this.profiles), { path: '/' });
  }
}
