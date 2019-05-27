import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Premises, CountriesType, PremisesType, HeatingsType } from '../shared/models';
import { PremisesService } from './../services/premises.service';

@Component({
  selector: 'app-premises',
  templateUrl: './premises.component.html',
  styleUrls: ['./premises.component.scss']
})

export class PremisesComponent {
  private PREMISES_URL = '/premises';

  premises$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.PREMISES_URL);

  constructor(private premisesService: PremisesService,
              private router: Router) { }

  showDetails(premises: Premises): void {
    this.loadPremisesDetails(premises);
    this.router.navigate(['premises', premises.id]);
  }

  private loadPremisesDetails(premises: Premises): void {
    this.premisesService.premisesDetailsInfo(premises);
  }

}
