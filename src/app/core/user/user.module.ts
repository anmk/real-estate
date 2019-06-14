import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [UserDetailsComponent],
  imports: [
    UserRoutingModule,
    SharedModule
  ]
})

export class UserModule { }
