import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import * as firebase from 'firebase/app';

import { User } from './user-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  fbUser: firebase.User;
  appUser: User = this.fbUser;
  appBaseUrl = location.origin;
  userDoc: AngularFirestoreDocument<User>;

  constructor(private afs: AngularFirestore,
              private matSnackBarToast: MatSnackBar) { }

  getUser(userId: string) {
    this.userDoc = this.afs.doc<User>(`users/${userId}`);
    return this.userDoc.valueChanges();
  }

  get currentUser() {
    return this.fbUser = firebase.auth().currentUser;
  }

  updateUserProfile(displayName: string, photoURL: string) {
    const user = this.fbUser;
    const data = {displayName, photoURL};
    return user.updateProfile(data)
      .then(() => this.afs.doc(`users/${user.uid}`).update({displayName, photoURL}))
      .then(() => this.onUpdateSuccess('Your profile has been updated!', ''))
      .then(() => console.log('Your profile has been updated - displayName:', displayName, 'photoURL: ', photoURL ))
      .catch((error: Error) => this.onUpdateFailure(error.message, ''))
      .catch((error: Error) => console.log(error.message));
  }

  updateUserEmail(email: string) {
    const user = this.fbUser;
    return user.updateEmail(email)
      .then(() => this.afs.doc(`users/${user.uid}`).update({email}))
      .then(() => this.onUpdateSuccess('Your email has been succesfully updated to: ', email))
      .then(() => console.log('Your email has been updated to: ', email))
      .catch((error: Error) => this.onUpdateFailure(error.message, ''))
      .catch((error: Error) => console.log(error.message));
  }

  updateAppUserContact(contact: string) {
    return this.afs.doc(`users/${this.fbUser.uid}`).update({contact})
    .then(() => this.onUpdateSuccess('Contact has been updated to: ', contact))
    .then(() => console.log('Contact has been updated to: ', contact))
    .catch((error: Error) => this.onUpdateFailure(error.message, ''))
    .catch((error: Error) => console.log(error.message));
  }

  updateAppUserSecondContact(secondContact: string) {
    return this.afs.doc(`users/${this.fbUser.uid}`).update({secondContact})
    .then(() => this.onUpdateSuccess('Your second contact has been changed to: ', secondContact))
    .then(() => console.log('Your second contact has been updated to: ', secondContact))
    .catch((error: Error) => this.onUpdateFailure(error.message, ''))
    .catch((error: Error) => console.log(error.message));
  }

  updateAppUserInfo(userInfo: string) {
    return this.afs.doc(`users/${this.fbUser.uid}`).update({userInfo})
    .then(() => this.onUpdateSuccess('Your informations has been succesfully saved!', ''))
    .then(() => console.log('Your informations has been updated to: ', userInfo))
    .catch((error: Error) => this.onUpdateFailure(error.message, ''))
    .catch((error: Error) => console.log(error.message));
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
