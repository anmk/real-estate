import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Premises, Photos, CountriesType, HeatingsType, PremisesType } from './../shared/models';

@Injectable({
  providedIn: 'root'
})
export class PremisesService {
  private PREMISES_URL = '/premises';

  selectedPremisesId$ = new Subject<string>();
  premisesDetailsSource$ = new Subject<Premises>();
  pathToPremisesSource$ = new ReplaySubject<string>();
  premisesDoc: AngularFirestoreDocument<Premises>;
  premisesUrls: AngularFirestoreDocument<[]>;
  photoDoc: AngularFirestoreDocument<Photos>;
  premises: Observable<Premises>;
  photo: Observable<Photos>;
  pathToPremises: string;
  user: Observable<Premises>;
  userDoc: AngularFirestoreDocument<Premises>;

  constructor( private afs: AngularFirestore) {}

  getPremises(link: string):
  (Observable<Premises[]>) | (Observable<PremisesType[]>) | (Observable<HeatingsType[]>) | (Observable<CountriesType[]>) {
    return this.getDataCollection(link);
  }

  getImages(link: string): Observable<Photos[]> {
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

  getPhotoById(link: string) {
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

  sharePath(path: string): void {
    this.pathToPremisesSource$.next(path);
  }

  timeOfAddingPremises(): number {
    return new Date().getTime();
  }

}
