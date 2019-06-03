import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/auth/auth.guard';
import { DashboardComponent } from './dashboard.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { PremisesSelectComponent } from './premises-select/premises-select.component';

const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
      children: [
        { path: '', component: FileUploadComponent },
        { path: '', component: PremisesSelectComponent }
      ]
    }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class DashboardRoutingModule {}
