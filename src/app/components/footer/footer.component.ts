import { Component } from '@angular/core';

// Material import
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';

import { environment } from '../../../environments/environment';
import { version } from '../../../environments/version';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatChipsModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  appVersion = version;
  environmentVariables = environment;
}
