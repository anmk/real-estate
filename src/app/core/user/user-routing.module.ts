import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserDetailsComponent } from './user-details/user-details.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  { path: 'profile', component: UserDetailsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class UserRoutingModule { }
