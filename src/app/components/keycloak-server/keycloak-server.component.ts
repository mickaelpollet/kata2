import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Specific modules
import { ToastrService } from 'ngx-toastr';
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType, typeEventArgs, ReadyArgs } from 'keycloak-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-keycloak-server',
  standalone: true,
  imports: [
    CommonModule,
    TimestampToDatePipe,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './keycloak-server.component.html',
  styleUrl: './keycloak-server.component.scss'
})
export class KeycloakServerComponent {
  
  private readonly keycloak = inject(Keycloak);
  private readonly keycloakSignal = inject(KEYCLOAK_EVENT_SIGNAL);
  authenticated = false;
  remainingTime = 0;
  private countdownInterval?: ReturnType<typeof setInterval>;
  warningThresholdInSeconds = 120;
  hasWarned = false;

  keycloakServer = {
    scope: '',
    exp: 0,
    iat: 0,
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
        this.keycloakServer.exp = keycloakObject?.['exp'] ?? 0;
        this.keycloakServer.iat = keycloakObject?.['iat'] ?? 0;
        this.keycloakServer.iss = keycloakObject?.['iss'] ?? '';
        this.keycloakServer.azp = keycloakObject?.['azp'] ?? '';
        this.keycloakServer.sid = keycloakObject?.['sid'] ?? '';
        this.keycloakServer.acr = keycloakObject?.['acr'] ?? '';
        this.keycloakServer.allowedOrigins = Array.isArray(keycloakObject?.['allowed-origins'])
          ? keycloakObject['allowed-origins']
          : [];

        // Token Expiration Countdown
        if (this.keycloakServer.exp && this.keycloakServer.iat) {
          const totalDuration = this.keycloakServer.exp - this.keycloakServer.iat;
          if (totalDuration / 3 >= this.warningThresholdInSeconds) {
              this.warningThresholdInSeconds = totalDuration / 3;
          }
          const elapsedSinceIat = Math.floor(Date.now() / 1000) - this.keycloakServer.iat;
          this.remainingTime = totalDuration - elapsedSinceIat;
          this.startCountdown();
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

  startCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  
    this.countdownInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
  
        if (this.remainingTime <= this.warningThresholdInSeconds && !this.hasWarned) {
          this.hasWarned = true;
          this.toastr.warning('Your session will expire soon!', 'Warning');
        }
  
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }


  getBadgeClass(): string {
    if (this.remainingTime > this.warningThresholdInSeconds) {
      return 'badge-success'; // Vert
    } else if (this.remainingTime > 60) {
      return 'badge-warning'; // Orange
    } else {
      return 'badge-danger'; // Rouge
    }
  }

  formatRemainingTime(seconds: number): string {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  }
}