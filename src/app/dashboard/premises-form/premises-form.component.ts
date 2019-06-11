import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { PremisesService } from '../../services/premises.service';
import { Premises, CountriesType, PremisesType, HeatingsType } from '../../shared/models';

import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-premises-form',
  templateUrl: './premises-form.component.html',
  styleUrls: ['./premises-form.component.scss']
})
export class PremisesFormComponent implements OnInit {
  private COUNTRIES_TYPE_URL = '/countries-type';
  private PREMISES_TYPE_URL = '/premises-type';
  private HEATINGS_TYPE_URL = '/heatings-type';

  premisesForm: FormGroup;
  breakpoint: number;
  tableRowsHeight: number;
  countriesType$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.COUNTRIES_TYPE_URL);
  premisesType$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.PREMISES_TYPE_URL);
  heatingsType$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.HEATINGS_TYPE_URL);

    public cols: Observable<number>;

  @Output() shownPremisesForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  watcher: Subscription;
  activeMediaQuery = '';

  constructor(private premisesService: PremisesService,
              private formBuilder: FormBuilder,
              private mediaObserver: MediaObserver) {
                this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
                  this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
                  this.breakpoint = ((change.mqAlias === 'xs') || (change.mqAlias === 'sm')) ? 1 : 2;
                  this.tableRowsHeight = ((change.mqAlias === 'xs')) ? 5.5 :
                  this.tableRowsHeight = ((change.mqAlias === 'sm')) ? 12 :
                  this.tableRowsHeight = ((change.mqAlias === 'md')) ? 9 : 12;
                });
               }

  ngOnInit(): void {
    this.buildPremisesForm();
    this.showPremisesForm();
    this.setTablePropertiesOnInit();
  }

  private setTablePropertiesOnInit() {
    this.breakpoint = this.mediaObserver.isActive('lt-md') ? 1 : 2;
    this.tableRowsHeight = this.mediaObserver.isActive('xs') ? 5.5 :
    this.tableRowsHeight = this.mediaObserver.isActive('sm') ? 12 :
    this.tableRowsHeight = this.mediaObserver.isActive('md') ? 9 : 12;
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
      heating: [''],
      fornished: [false],
      rented: [false]
    });
  }

  private showPremisesForm(): void {
    this.shownPremisesForm.emit(this.premisesForm);
  }

}
