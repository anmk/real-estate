import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { Photos } from '../../../shared/models';
import { PremisesService } from '../../../services/premises.service';

@Component({
  selector: 'app-premises-details-photo-view',
  templateUrl: './premises-details-photo-view.component.html',
  styleUrls: ['./premises-details-photo-view.component.scss']
})

export class PremisesDetailsPhotoViewComponent implements OnInit, OnDestroy {
  image: Photos;
  private id: string;
  private dataSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private premisesService: PremisesService) { }

  ngOnInit(): void {
    this.getImage();
  }

  private getImage(): void {
    this.id = this.activatedRoute.snapshot.parent.url[1].path;

    this.dataSubscription = this.activatedRoute.paramMap.pipe(
      map(params => params.get('pid')),
      switchMap(pid => this.premisesService.getPhotoByLink(`premises/${this.id}/imageUrls/${pid}`))
    )
    .subscribe(image => this.image = image);
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

}
