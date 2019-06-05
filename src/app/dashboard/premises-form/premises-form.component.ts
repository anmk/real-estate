import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { MatGridList } from '@angular/material';
import { MediaChange } from '@angular/flex-layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { PremisesService } from '../../services/premises.service';
import { Premises, CountriesType, PremisesType, HeatingsType } from '../../shared/models';

@Component({
  selector: 'app-premises-form',
  templateUrl: './premises-form.component.html',
  styleUrls: ['./premises-form.component.scss']
})

export class PremisesFormComponent implements OnInit, AfterContentInit, OnDestroy {
  private COUNTRIES_TYPE_URL = '/countries-type';
  private PREMISES_TYPE_URL = '/premises-type';
  private HEATINGS_TYPE_URL = '/heatings-type';

  private dataSubscription: Subscription;
  premisesForm: FormGroup;

  countriesType$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.COUNTRIES_TYPE_URL);
  premisesType$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.PREMISES_TYPE_URL);
  heatingsType$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.HEATINGS_TYPE_URL);

  @ViewChild('grid') grid: MatGridList;
  @Output() shownPremisesForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  constructor(private premisesService: PremisesService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.buildPremisesForm();
    this.showPremisesForm();
  }

  ngAfterContentInit(): void {
    this.dataSubscription = this.premisesService.adjustToMedia().subscribe((change: MediaChange) => {
      const gridPreparation = this.premisesService.gridByBreakpoint[change.mqAlias] * 0.5;
      this.grid.cols = (gridPreparation >= 1.5) ? 2 : 1;
    });
  }

  private buildPremisesForm(): void {
    this.premisesForm = this.formBuilder.group({
      premises: ['', [Validators.required] ],
      country: ['Poland'],
      city: ['', [Validators.required, Validators.minLength(2)] ],
      street: ['', [Validators.required, Validators.minLength(2)] ],
      streetNumber: ['', [Validators.required, Validators.pattern('[0-9.a-zA-Z]{1,5}')] ],
      flat: ['',  [Validators.pattern('[0-9.a-zA-Z]{1,4}')] ],
      area: ['',  [Validators.pattern('[0-9.]{1,4}')] ],
      additionalInformations: ['', [Validators.maxLength(2000)] ],
      thumbnailUrl: [''],
      heating: [''],
      fornished: [false],
      rented: [false]
    });
  }

  private showPremisesForm(): void {
    this.shownPremisesForm.emit(this.premisesForm);
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

}
