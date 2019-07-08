import { NgModule } from '@angular/core';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { DashboardComponent } from './dashboard.component';
import { PremisesFormComponent } from './premises-form/premises-form.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DropZoneDirective } from '../shared/directives/drop-zone.directive';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileSizePipe } from '../shared/pipes/file-size.pipe';
import { PremisesSelectComponent } from './premises-select/premises-select.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    PremisesFormComponent,
    FileUploadComponent,
    DropZoneDirective,
    FileSizePipe,
    PremisesSelectComponent
  ],
  imports: [
    DashboardRoutingModule,
    AngularFireStorageModule,
    SharedModule
  ]
})
export class DashboardModule { }
