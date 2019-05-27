import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PremisesComponent } from './premises.component';
import { PremisesDetailsComponent } from './premises-details/premises-details.component';
import { PremisesDetailsPhotoViewComponent } from './premises-details/premises-details-photo-view/premises-details-photo-view.component';
import { PremisesDetailsPhotoListComponent } from './premises-details/premises-details-photo-list/premises-details-photo-list.component';

const routes: Routes = [
  { path: 'premises', component: PremisesComponent },
  { path: 'premises/:id', component: PremisesDetailsComponent,
      children: [
        { path: '', component: PremisesDetailsPhotoListComponent, outlet: 'list' },
        { path: 'imageUrls/:pid', component: PremisesDetailsPhotoViewComponent }
      ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: []
})

export class PremisesRoutingModule {}
