import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PremisesService } from '../../services/premises.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})

export class FileUploadComponent {
  @Input() premisesIdToPhoto: string;
  @Input() premisesForm: FormGroup;
  @Output() uploadStatus = new EventEmitter();

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;
  isHovering: boolean;

  constructor(private storage: AngularFireStorage,
              private premisesService: PremisesService,
              private matSnackBarToast: MatSnackBar) { }

  toggleHover(event: boolean): void {
    this.isHovering = (this.premisesIdToPhoto || this.premisesForm) ? event : false;
  }

  startUpload(event: FileList) {
    const file = event.item(0);
    const fileType = file.type.split('/')[0];

    if ((fileType !== 'image') || (!this.premisesIdToPhoto) && (!this.premisesForm)) {
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
          this.premisesService.sharePath(this.downloadURL);
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

  private onUpdateSuccess(info: string, additionalInfo: string): void {
    this.matSnackBarToast.open(info, additionalInfo, { panelClass: 'toast-success' });
    // console.log(info);
  }

  private onUpdateFailure(info: string, additionalInfo: string): void {
    this.matSnackBarToast.open(info, additionalInfo, { panelClass: 'toast-error' });
    // console.error(info);
  }

}
