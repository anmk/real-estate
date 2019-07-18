import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { PremisesService } from './../../services/premises.service';
import { Premises } from './../../shared/models';

@Component({
  selector: 'app-premises-details',
  templateUrl: './premises-details.component.html',
  styleUrls: ['./premises-details.component.scss']
})
export class PremisesDetailsComponent implements OnInit {
  premises$: Observable<Premises>;

  constructor(protected activatedRoute: ActivatedRoute,
              protected premisesService: PremisesService) {}

  ngOnInit(): void {
    this.getPremises();
  }

  protected getPremises(): void {
    this.premises$ = this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.premisesService.getPremisesById(id))
    );
  }

}
