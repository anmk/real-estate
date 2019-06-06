import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { Premises, CountriesType, PremisesType, HeatingsType } from '../../shared/models';
import { PremisesService } from '../../services/premises.service';


@Component({
  selector: 'app-premises-select',
  templateUrl: './premises-select.component.html',
  styleUrls: ['./premises-select.component.scss']
})

export class PremisesSelectComponent implements OnDestroy {
  private PREMISES_URL = '/premises';

  private dataSubscription: Subscription;
  chosenPremises: string;
  premisesData: Premises;

  premises$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.PREMISES_URL);

  @Output() sharedPremisesId = new EventEmitter();

  constructor(private premisesService: PremisesService) {}

  sharePremisesId(): void {
    this.sharedPremisesId.emit(this.chosenPremises);
  }

  confirmationSelectedPremises(): void {
    this.dataSubscription = null;
    this.dataSubscription = this.premisesService.getPremisesById(this.chosenPremises)
    .subscribe(premises => {
      this.premisesData = premises;
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

}
