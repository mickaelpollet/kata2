import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material import
import { MatTabsModule } from '@angular/material/tabs';

// Specific imports
import * as CryptoJS from 'crypto-js';
import { JsonHighlightPipe } from '../../pipes/json-highlight.pipe';


@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,    
    MatTabsModule,
    JsonHighlightPipe    
  ],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.scss'
})
export class ToolsComponent {

  jwt = '';
  secret = '';
  decoded: any = {};
  signatureValid: boolean | null = null;

  decodeJWT() {
    this.signatureValid = null;
    try {
      const parts = this.jwt.trim().split('.');
      if (parts.length !== 3) {
        this.decoded = { error: 'JWT token need to have 3 specific parts (header.payload.signature)' };
        return;
      }

      const decodeBase64 = (str: string) =>
        JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));

      const header = decodeBase64(parts[0]);
      const payload = decodeBase64(parts[1]);

      // Checking HMAC-SHA256 signature if key is here
      if (this.secret) {
        const signingInput = `${parts[0]}.${parts[1]}`;
        const expectedSig = CryptoJS.HmacSHA256(signingInput, this.secret)
          .toString(CryptoJS.enc.Base64)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        this.signatureValid = expectedSig === parts[2];
      }

      this.decoded = { header, payload };
    } catch (err) {
      this.decoded = { error: 'Decoding error : ' + (err as Error).message };
    }
  }

  jsonInput = '';
  jsonParsed: any = null;
  jsonError: string | null = null;

  parseJsonInput() {
    this.jsonError = null;
    try {
      this.jsonParsed = JSON.parse(this.jsonInput);
    } catch (e) {
      this.jsonParsed = null;
      this.jsonError = 'Invalid JSON : ' + (e as Error).message;
    }
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

}