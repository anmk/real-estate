import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { PremisesService } from '../services/premises.service';
import { Photos, Premises } from '../shared/models';
import { UserService } from '../core/user/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private imageUrls: Photos;
  uploadStatus: boolean;
  premisesForm: FormGroup;
  premisesIdToPhoto: string;
  addPhotosActive = false;
  premise$: Observable<Premises>;
  photos$: Observable<Photos[]>;
  numberOfPhotos: number;
  buttonStatus: boolean;
  private thumbnailSubscription: Subscription;
  private photoSubscription: Subscription;
  private deleteSubscription: Subscription;
  numberOfPhotoSubscription: Subscription;
  private buttonStatusSubscription: Subscription;

  constructor(protected userService: UserService,
              protected premisesService: PremisesService,
              protected matSnackBarToast: MatSnackBar) { }

ngOnInit() {
  this.getButtonStatus();
}

  onSharedPremisesId(premisesId: string): void {
    this.premisesIdToPhoto = premisesId;
    this.checkPhotos(this.premisesIdToPhoto);
  }

  onShownPremisesForm(premisesForm: FormGroup): void {
    this.premisesForm = premisesForm;
  }

  createPremises() {
    this.getThumbnailPath();
    this.premisesForm.value.time = this.premisesService.timeOfAddingPremises();
    this.premisesForm.value.userId = this.userService.currentUser.uid;
    return this.premisesService.addPremises(this.premisesForm.value)
      .then(this.onPremisesSuccess.bind(this), this.onPremisesFailure.bind(this));
  }

  createPhotoLink() {
    this.getPhotoPath();
    return this.premisesService
      .addPhotos(
        {url: this.imageUrls.url, nameInStorage: this.imageUrls.nameInStorage},
        this.premisesIdToPhoto
      )
      .then(this.onPhotoLinkSuccess.bind(this), this.onPhotoLinkFailure.bind(this));
  }

  deletePremises() {
    this.getPremises();
    this.checkPhotos(this.premisesIdToPhoto);
    this.deleteSubscription = this.premise$.subscribe((premisesData => {
      if (premisesData) {
        this.premisesService.deletePremises(this.premisesIdToPhoto, premisesData.thumbnail.nameInStorage);
        this.premisesIdToPhoto = null;
      }
      }));
  }

  checkPhotos(premiseId: string): void {
    this.photos$ = this.premisesService.getImages(`/premises/${premiseId}/imageUrls`);
    this.numberOfPhotoSubscription = this.photos$.subscribe(images => {
      this.numberOfPhotos = images.length;
    });
  }

  private getPremises() {
    this.premise$ = this.premisesService.getPremisesById(this.premisesIdToPhoto);
  }

  private getThumbnailPath(): void {
    this.thumbnailSubscription = this.premisesService.pathToPremisesSource$
      .subscribe((photoData => {
        this.premisesForm.value.thumbnail = photoData;
      }));
  }

  private getPhotoPath(): void {
    this.photoSubscription = this.premisesService.pathToPremisesSource$
      .subscribe((photoData => {
        this.imageUrls = photoData;
      }));
  }

  onStatus(uploadStatus: boolean): void {
    this.getPhotoPath();
    this.addPhotosActive = ((this.premisesIdToPhoto !== null) &&
      (this.imageUrls.url !== null) && (uploadStatus !== false)) ? true : false;
  }

  getButtonStatus(): void {
    this.buttonStatusSubscription = this.premisesService.buttonStatusSource$
      .subscribe( status => {
        this.buttonStatus = status;
    });
  }

  private onPremisesSuccess(): void {
    this.matSnackBarToast.open('Premises has been succesfully created!', '', { panelClass: 'toast-success' });
    console.log('success');
  }

  private onPremisesFailure(error: Error): void {
    this.matSnackBarToast.open(error.message, '', { panelClass: 'toast-error' });
    console.error('some error');
  }

  private onPhotoLinkSuccess(): void {
    this.matSnackBarToast.open('Image has been succesfully added!', '', { panelClass: 'toast-success' });
    console.log('success');
  }

  private onPhotoLinkFailure(error: Error): void {
    this.matSnackBarToast.open(error.message, '', { panelClass: 'toast-error' });
    console.error('some error');
  }

  ngOnDestroy(): void {
    if (this.thumbnailSubscription) {
      this.thumbnailSubscription.unsubscribe();
    }
    if (this.photoSubscription) {
      this.photoSubscription.unsubscribe();
    }
    if (this.numberOfPhotoSubscription) {
      this.numberOfPhotoSubscription.unsubscribe();
    }
    if (this.deleteSubscription) {
      this.deleteSubscription.unsubscribe();
    }
    if (this.buttonStatusSubscription) {
      this.buttonStatusSubscription.unsubscribe();
    }
  }

}
