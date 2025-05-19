import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { ToolsComponent } from './components/tools/tools.component';
import { PrivateComponent } from './components/private/private.component';
import { AdminComponent } from './components/admin/admin.component';
import { ErrorComponent } from './components/error/error.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { canActivateAuthRole } from './guards/auth-role.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: 'tools',
        component: ToolsComponent
    },
    {
        path: 'private',
        component: PrivateComponent,
        // canActivate: [canActivateAuthRole],
        // data: { role: 'admin' }
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [canActivateAuthRole],
        data: { role: 'admin' }
    },
    {
        path: 'error',
        component: ErrorComponent,
        canActivate: [canActivateAuthRole],
        data: { role: 'view-profile' }
    },
    { path: 'forbidden', component: ForbiddenComponent },
    { path: '**', component: ErrorComponent }
];