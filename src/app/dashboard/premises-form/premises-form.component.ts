import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { PremisesService } from '../../services/premises.service';
import { Premises, CountriesType, PremisesType, HeatingsType} from '../../shared/models';

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
  buttonStatus = false;
  updatePremisesData: Premises;

  countriesType$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.COUNTRIES_TYPE_URL);
  premisesType$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.PREMISES_TYPE_URL);
  heatingsType$: Observable<Premises[] | PremisesType[] | HeatingsType[] | CountriesType[]> =
    this.premisesService.getPremises(this.HEATINGS_TYPE_URL);

  @Output() shownPremisesForm: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();
  @Input() premisesIdToPhoto: string;

  constructor(private premisesService: PremisesService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (!this.premisesIdToPhoto) {
      this.buildPremisesForm();
    } else {
      this.editPremisesForm();
    }
    this.showPremisesForm();
    this.setTablePropertiesOnInit();
    this.onFormChanges();
    this.loadPremisesFormInfo(this.premisesForm);
  }

  setTablePropertiesOnResize(event): void {
    this.breakpoint = (event.target.innerWidth <= 960) ? 1 : 2;
    this.tableRowsHeight = (event.target.innerWidth <= 600) ? 5.5 :
    this.tableRowsHeight = (event.target.innerWidth <= 960) ? 12 :
    this.tableRowsHeight = (event.target.innerWidth <= 1280) ? 9 : 12;
  }

  private setTablePropertiesOnInit(): void {
    this.breakpoint = (window.innerWidth <= 960) ? 1 : 2;
    this.tableRowsHeight = (window.innerWidth <= 600) ? 5.5 :
    this.tableRowsHeight = (window.innerWidth <= 960) ? 12 :
    this.tableRowsHeight = (window.innerWidth <= 1280) ? 9 : 12;
  }

  private buildPremisesForm(): void {
    this.premisesForm = this.formBuilder.group({
      premises: ['', [Validators.required] ],
      country: ['Poland'],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)] ],
      street: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)] ],
      streetNumber: ['', [Validators.required, Validators.pattern('[0-9.a-zA-Z]{1,5}')] ],
      flat: ['',  [Validators.pattern('[0-9.a-zA-Z]{1,4}')] ],
      area: ['',  [Validators.pattern('[0-9.]{1,4}')] ],
      additionalInformations: ['', [Validators.maxLength(2000)] ],
      heating: [''],
      fornished: [false],
      rented: [false]
    });
  }

  private editPremisesForm(): void {
    this.premisesService.premisesDetailsSource$.subscribe(premises => {
      this.updatePremisesData = premises;
    });
    this.premisesForm = this.formBuilder.group({
      premises: [this.updatePremisesData.premises, [Validators.required] ],
      country: [this.updatePremisesData.country],
      city: [this.updatePremisesData.city, [Validators.required, Validators.minLength(2), Validators.maxLength(40)] ],
      street: [this.updatePremisesData.street, [Validators.required, Validators.minLength(2), Validators.maxLength(50)] ],
      streetNumber: [this.updatePremisesData.streetNumber, [Validators.required, Validators.pattern('[0-9.a-zA-Z]{1,5}')] ],
      flat: [this.updatePremisesData.flat,  [Validators.pattern('[0-9.a-zA-Z]{1,4}')] ],
      area: [this.updatePremisesData.area,  [Validators.pattern('[0-9.]{1,4}')] ],
      additionalInformations: [this.updatePremisesData.additionalInformations, [Validators.maxLength(2000)] ],
      heating: [this.updatePremisesData.heating],
      fornished: [this.updatePremisesData.fornished],
      rented: [this.updatePremisesData.rented]
    });
  }

  editPremises() {
    return this.premisesService.updatePremises(this.premisesForm.value, this.premisesIdToPhoto);
  }

  private showPremisesForm(): void {
    this.shownPremisesForm.emit(this.premisesForm);
  }

  private onFormChanges(): void {
    this.premisesForm.statusChanges
      .subscribe(val => {
        if (val === 'VALID') {
          this.buttonStatus = true;
          this.shareButtonStatus();
        } else {
          this.buttonStatus = false;
          this.shareButtonStatus();
        }
      });
  }

  private shareButtonStatus(): void {
    this.premisesService.shareButtonStatusSource(this.buttonStatus);
  }

  private loadPremisesFormInfo(premisesForm: FormGroup): void {
    this.premisesService.premisesFormInfo(premisesForm);
  }

}
