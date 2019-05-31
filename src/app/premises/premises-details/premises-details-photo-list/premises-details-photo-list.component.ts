import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { PremisesDetailsComponent } from '../premises-details.component';
import { Premises, Photos } from '../../../shared/models';
import { PremisesService } from '../../../services/premises.service';

@Component({
  selector: 'app-premises-details-photo-list',
  templateUrl: './premises-details-photo-list.component.html',
  styleUrls: ['./premises-details-photo-list.component.scss']
})

export class PremisesDetailsPhotoListComponent extends PremisesDetailsComponent implements OnInit {
  premises$: Observable<Premises>;
  photos$: Observable<Photos[]>;

  constructor(protected activatedRoute: ActivatedRoute,
              protected premisesService: PremisesService) {
    super(activatedRoute, premisesService);
  }

  ngOnInit(): void {
    this.getPremises();
    this.getPhotos();
  }

  private getPhotos(): void {
    this.photos$ = this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.premisesService.getImages(`/premises/${id}/imageUrls`))
      );
  }

}
