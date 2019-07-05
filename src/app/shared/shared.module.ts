import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from './material/material.module';
import { UserInfoComponent } from './components/user-info/user-info.component';

@NgModule({
  declarations: [UserInfoComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    UserInfoComponent
  ]
})

export class SharedModule { }
