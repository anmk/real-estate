import { Component, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PremisesService } from '../services/premises.service';
import { Photos } from '../shared/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnDestroy {
  private imageUrls: Photos;
  uploadStatus: boolean;
  premisesForm: FormGroup;
  premisesIdToPhoto: string;
  addPhotosActive = false;
  private thumbnailSubscription: Subscription;
  private photoSubscription: Subscription;

  constructor(private premisesService: PremisesService,
              private matSnackBarToast: MatSnackBar) { }

  onSharedPremisesId(premisesId: string): void {
    this.premisesIdToPhoto = premisesId;
  }

  onShownPremisesForm(premisesForm: FormGroup): void {
    this.premisesForm = premisesForm;
  }

  createPremises() {
    this.getThumbnailPath();
    this.premisesForm.value.time = this.premisesService.timeOfAddingPremises();
    return this.premisesService.addPremises(this.premisesForm.value)
      .then(this.onPremisesSuccess.bind(this), this.onPremisesFailure.bind(this));
  }

  createPhotoLink() {
    this.getPhotoPath();
    return this.premisesService.addPhotos({url: this.imageUrls.url, description: ''}, this.premisesIdToPhoto)
      .then(this.onPhotoLinkSuccess.bind(this), this.onPhotoLinkFailure.bind(this));
  }

  private getThumbnailPath(): void {
    this.thumbnailSubscription = this.premisesService.pathToPremisesSource$
      .subscribe((path => {
        this.premisesForm.value.thumbnailUrl = path;
      }));
  }

  private getPhotoPath(): void {
    this.photoSubscription = this.premisesService.pathToPremisesSource$
      .subscribe((path => {
        this.imageUrls = {};
        this.imageUrls.url = path;
      }));
  }

  onStatus(uploadStatus: boolean): void {
    this.getPhotoPath();
    this.addPhotosActive = ((this.premisesIdToPhoto !== null) &&
      (this.imageUrls.url !== null) && (uploadStatus !== false)) ? true : false;
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
  }

}
