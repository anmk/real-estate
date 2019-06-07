import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
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
              private premisesService: PremisesService) { }

  toggleHover(event: boolean): void {
    this.isHovering = (this.premisesIdToPhoto || this.premisesForm) ? event : false;
  }

  startUpload(event: FileList) {
    const file = event.item(0);

    if ((file.type.split('/')[0] !== 'image') || (!this.premisesIdToPhoto) && (!this.premisesForm)) {
      console.error('unsupported file type or missing premises id or form data :( ');
      return;
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
        }
      })
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}
