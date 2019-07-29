import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Premises, Photos, CountriesType, HeatingsType, PremisesType } from './../shared/models';
import { User } from '../core/user/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class PremisesService {
  private PREMISES_URL = '/premises';

  selectedPremisesId$ = new Subject<string>();
  premisesDetailsSource$ = new Subject<Premises>();
  buttonStatusSource$ = new Subject<boolean>();
  pathToPremisesSource$ = new ReplaySubject<Photos>();
  premisesDoc: AngularFirestoreDocument<Premises>;
  premisesUrls: AngularFirestoreDocument<[]>;
  photoDoc: AngularFirestoreDocument<Photos>;
  premises: Observable<Premises>;
  photo: Observable<Photos>;
  pathToPremises: string;
  user: Observable<Premises>;
  userDoc: AngularFirestoreDocument<Premises>;
  radioButtonStatus = false;

  constructor(private afs: AngularFirestore,
              private storage: AngularFireStorage,
              private matSnackBarToast: MatSnackBar) {}

  getPremises(link: string):
  (Observable<Premises[]>) | (Observable<PremisesType[]>) | (Observable<HeatingsType[]>) | (Observable<CountriesType[]>) {
    return this.getDataCollection(link);
  }

  getImages(link: string): Observable<Photos[]> {
    return this.getDataCollection(link);
  }

  getUsers(link: string): Observable<User[]> {
    return this.getDataCollection(link);
  }

  private getDataCollection(link: string) {
    return this.afs.collection(link)
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => this.assignId(doc));
        })
      );
  }

  private assignId(doc) {
    return { ...doc.payload.doc.data(), id: doc.payload.doc.id };
  }

  getPremisesById(id: string) {
    this.premisesDoc = this.afs.doc<Premises>('premises/' + id);
    return this.premises = this.premisesDoc.valueChanges();
  }

  getPhotoByLink(link: string) {
    this.photoDoc = this.afs.doc<Photos>(link);
    return this.photo = this.photoDoc.valueChanges();
  }

  addPremises(premises: Premises[]) {
    return this.afs.collection<Premises[]>(this.PREMISES_URL).add(premises);
  }

  addPhotos(photos: Photos, premisesId: string) {
    return this.afs.collection<Photos>('premises').doc(premisesId)
      .collection('imageUrls').add(photos);
  }

  premisesDetailsInfo(premises: Premises) {
    this.premisesDetailsSource$.next(premises);
    return this.premisesDetailsSource$.asObservable();
  }

  shareSelectedPremisesId(premisesId: string) {
    this.selectedPremisesId$.next(premisesId);
    return this.selectedPremisesId$.asObservable();
  }

  shareButtonStatusSource(buttonStatus: boolean) {
    this.buttonStatusSource$.next(buttonStatus);
    return this.buttonStatusSource$.asObservable();
  }

  sharePath(photoData: Photos): void {
    this.pathToPremisesSource$.next(photoData);
  }

  timeOfAddingPremises(): number {
    return new Date().getTime();
  }

  deleteImage(id: string, pid: string, name: string) {
    // Delete from storage
    this.storage.ref('premisesPhotos').child(name).delete().toPromise()
    .then(
      // Delete from database
      this.afs.doc(`premises/${id}/imageUrls/${pid}`).delete()
      .then(() => this.onUpdateSuccess('Image has been deleted!', ''))
      .catch((error: Error) => this.onUpdateFailure(error.message, ''))
    )
    .catch((error: Error) => this.onUpdateFailure(error.message, ''));
  }

  deletePremises(id: string, name: string) {
    // Delete from storage
    this.storage.ref('premisesPhotos').child(name).delete().toPromise()
    .then(
      // Delete from database
      this.afs.doc(`premises/${id}`).delete()
      .then(() => this.onUpdateSuccess('Premises has been deleted!', ''))
      .catch((error: Error) => this.onUpdateFailure(error.message, ''))
    )
    .catch((error: Error) => this.onUpdateFailure(error.message, ''));
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
