import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatTabsModule,
  MatCardModule,
  MatGridListModule,
  MatSnackBarModule,
  MatSelectModule,
  MatOptionModule,
  MatSlideToggleModule,
  MatSnackBarConfig,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatTableModule,
  MatProgressBarModule,
  MatRadioModule,
  MatBadgeModule
} from '@angular/material';

const MAT_SNACK_BAR_GLOBAL_CONFIG: MatSnackBarConfig = {
  duration: 3000,
  verticalPosition: 'bottom',
  horizontalPosition: 'center'
};

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatOptionModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatTabsModule,
  MatCardModule,
  MatGridListModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatTableModule,
  MatProgressBarModule,
  MatRadioModule,
  MatBadgeModule
];

@NgModule({
  declarations: [],
  imports: [],
  exports: [ ...MATERIAL_MODULES ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: MAT_SNACK_BAR_GLOBAL_CONFIG }
  ]
})
export class MaterialModule { }
