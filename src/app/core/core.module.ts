import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PremisesService } from './../services/premises.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule,
    UserModule
  ],
  providers: [
    AuthService,
    PremisesService
  ],
})

export class CoreModule { }
