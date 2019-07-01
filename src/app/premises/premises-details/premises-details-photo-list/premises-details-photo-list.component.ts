import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { PremisesDetailsComponent } from '../premises-details.component';
import { PremisesService } from '../../../services/premises.service';
import { UserService } from '../../../core/user/user.service';
import { Premises, Photos } from '../../../shared/models';
import { User } from '../../../core/user/user-data.model';

@Component({
  selector: 'app-premises-details-photo-list',
  templateUrl: './premises-details-photo-list.component.html',
  styleUrls: ['./premises-details-photo-list.component.scss']
})
export class PremisesDetailsPhotoListComponent extends PremisesDetailsComponent implements OnInit {
  private USERS_URL = '/users';
  anonymous = `${this.userService.appBaseUrl}/assets/svg-files/icons8-anonymous-mask.svg`;

  premises$: Observable<Premises>;
  photos$: Observable<Photos[]>;
  users$: Observable<User[]>;

  constructor(protected activatedRoute: ActivatedRoute,
              protected premisesService: PremisesService,
              private userService: UserService) {
    super(activatedRoute, premisesService);
  }

  ngOnInit(): void {
    this.getPremises();
    this.getPhotos();
    this.getUsers();
  }

  private getPhotos(): void {
    this.photos$ = this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.premisesService.getImages(`/premises/${id}/imageUrls`))
    );
  }

  getUsers() {
    this.users$ = this.premisesService.getUsers(this.USERS_URL);
  }
}
