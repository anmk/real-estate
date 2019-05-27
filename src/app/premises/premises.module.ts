import { NgModule } from '@angular/core';

import { PremisesComponent } from './premises.component';
import { PremisesCardComponent } from './premises-card/premises-card.component';
import { PremisesDetailsComponent } from './premises-details/premises-details.component';
import { PremisesRoutingModule } from './premises-routing.module';
import { PremisesDetailsPhotoViewComponent } from './premises-details/premises-details-photo-view/premises-details-photo-view.component';
import { PremisesDetailsPhotoListComponent } from './premises-details/premises-details-photo-list/premises-details-photo-list.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PremisesComponent,
    PremisesCardComponent,
    PremisesDetailsComponent,
    PremisesDetailsPhotoViewComponent,
    PremisesDetailsPhotoListComponent
  ],
  imports: [
    PremisesRoutingModule,
    SharedModule
  ]
})

export class PremisesModule { }
