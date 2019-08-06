import { Component, Output, EventEmitter, Input, OnInit, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PremisesService } from '../../services/premises.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {
  @Input() premisesIdToPhoto: string;
  @Output() uploadStatus = new EventEmitter();

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  isHovering: boolean;
  buttonStatus: boolean;
  premisesForm: FormGroup;
  private buttonStatusSubscription: Subscription;
  private premisesFormInfoSubscription: Subscription;

  constructor(private storage: AngularFireStorage,
              private premisesService: PremisesService,
              private matSnackBarToast: MatSnackBar) { }

  ngOnInit() {
    this.getButtonStatus();
    this.getPremisesFormInfo();
  }

  toggleHover(event: boolean): void {
    this.isHovering = (this.premisesIdToPhoto || this.premisesForm.valid) ? event : false;
  }

  startUpload(event: FileList) {
    const file = event.item(0);
    const fileType = file.type.split('/')[0];

    if ((fileType !== 'image') || (!this.premisesIdToPhoto) && (!this.premisesForm.valid)) {
      console.error('Unsupported file type or missing premises id or form data :( ');
      return alert('Unsupported file type or missing premises id or form data :( ');
    }

    const basePath = 'premisesPhotos';
    const nameInStorage = `${new Date().getTime()}_${file.name}`;
    const path = `${basePath}/${nameInStorage}`;
    const customMetadata = { app: 'Photos of premises!' };

    this.task = this.storage.upload(path, file, { customMetadata });
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges();

    const ref = this.storage.ref(path);
    this.snapshot = this.task.snapshotChanges().pipe(
      finalize( async () =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        if (this.downloadURL) {
          const photoData = {
            url: this.downloadURL,
            nameInStorage
          };
          this.premisesService.sharePath(photoData);
          this.uploadStatus.emit(true);
          this.onUpdateSuccess('Your photo has been uploaded!', '');
          console.log('Your photo has been uploaded! Download URL: ', this.downloadURL);
        } else {
          this.uploadStatus.emit(false);
          this.onUpdateFailure('An error occured', '');
          console.log('An error occured');
        }
      })
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

  private getButtonStatus(): void {
    this.buttonStatusSubscription = this.premisesService.buttonStatusSource$
      .subscribe( status => {
        this.buttonStatus = status;
    });
  }

  private getPremisesFormInfo(): void {
    this.premisesFormInfoSubscription = this.premisesService.premisesFormSource$
      .subscribe( info => {
        this.premisesForm = info;
    });
  }

  private onUpdateSuccess(info: string, additionalInfo: string): void {
    this.matSnackBarToast.open(info, additionalInfo, { panelClass: 'toast-success' });
    // console.log(info);
  }

  private onUpdateFailure(info: string, additionalInfo: string): void {
    this.matSnackBarToast.open(info, additionalInfo, { panelClass: 'toast-error' });
    // console.error(info);
  }

  ngOnDestroy(): void {
    if (this.buttonStatusSubscription) {
      this.buttonStatusSubscription.unsubscribe();
    }
    if (this.premisesFormInfoSubscription) {
      this.premisesFormInfoSubscription.unsubscribe();
    }
  }
}
