import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { UserInfo } from 'firebase';

import { Premises, CountriesType, PremisesType, HeatingsType } from '../../shared/models';
import { PremisesService } from '../../services/premises.service';
import { UserService } from '../../core/user/user.service';
import { DashboardComponent } from '../dashboard.component';

@Component({
  selector: 'app-premises-select',
  templateUrl: './premises-select.component.html',
  styleUrls: ['./premises-select.component.scss']
})
export class PremisesSelectComponent extends DashboardComponent implements OnDestroy {
  private PREMISES_URL = '/premises';

  chosenPremises: string;
  premisesData: Premises;
  buttonStatus = false;
  user: UserInfo = this.userService.currentUser;
  premises$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.PREMISES_URL);
  private selectedSubscription: Subscription;

  @Output() sharedPremisesId = new EventEmitter();

  constructor(protected userService: UserService,
              protected premisesService: PremisesService,
              protected matSnackBarToast: MatSnackBar) {
    super(userService, premisesService, matSnackBarToast);
  }

  sharePremisesId(): void {
    this.sharedPremisesId.emit(this.chosenPremises);
    this.confirmationSelectedPremises();
    this.checkButton();
  }

  confirmationSelectedPremises(): void {
    this.selectedSubscription = null;
    this.selectedSubscription = this.premisesService.getPremisesById(this.chosenPremises)
      .subscribe(premises => {
        this.premisesData = premises;
        this.premisesService.premisesDetailsInfo(premises);
      });
    this.checkPhotos(this.chosenPremises);
  }

  changePremises() {
    this.premisesData = null;
    this.sharedPremisesId.emit(null);
    this.checkButton();
  }

  checkButton() {
    this.buttonStatus = !this.buttonStatus;
    this.shareButtonStatus();
  }

  shareButtonStatus(): void {
    this.premisesService.shareButtonStatusSource(this.buttonStatus);
  }

  ngOnDestroy(): void {
    if (this.selectedSubscription) {
      this.selectedSubscription.unsubscribe();
    }
  }

}
