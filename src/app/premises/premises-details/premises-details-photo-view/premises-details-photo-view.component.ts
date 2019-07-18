import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { UserInfo } from 'firebase';

import { Photos, Premises } from '../../../shared/models';
import { PremisesService } from '../../../services/premises.service';
import { UserService } from '../../../core/user/user.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-premises-details-photo-view',
  templateUrl: './premises-details-photo-view.component.html',
  styleUrls: ['./premises-details-photo-view.component.scss']
})
export class PremisesDetailsPhotoViewComponent implements OnInit, OnDestroy {
  premises$: Observable<Premises>;
  image: Photos;
  private id: string;
  private pid: string;
  user: UserInfo = this.userService.currentUser;
  auth: boolean = this.authService.isAuth();
  private dataSubscription: Subscription;
  private deleteSubscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private premisesService: PremisesService,
              private userService: UserService,
              private authService: AuthService) {}

  ngOnInit(): void {
    this.getImage();
    this.getPremises();
  }

  private getImage(): void {
    this.id = this.activatedRoute.snapshot.parent.url[1].path;

    this.dataSubscription = this.activatedRoute.paramMap.pipe(
      map(params => params.get('pid')),
      switchMap(pid => this.premisesService.getPhotoByLink(`premises/${this.id}/imageUrls/${pid}`))
    )
    .subscribe(image => {
      this.image = image;
    });
  }

  private getPremises(): void {
    this.premises$ = this.premisesService.getPremisesById(this.id);
  }

  delete(): void {
    this.id = this.activatedRoute.snapshot.parent.url[1].path;
    this.deleteSubscription = this.activatedRoute.paramMap.pipe(
      map(params => params.get('pid'))
    )
    .subscribe(pid =>  {
      this.pid = pid;
    });
    this.premisesService.deleteImage(this.id, this.pid, this.image.nameInStorage);
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
  }

}
