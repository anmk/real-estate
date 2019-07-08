import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import * as firebase from 'firebase/app';

import { UserService } from './../user.service';
import { User } from './../user-data.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, OnDestroy {
  fbUser: firebase.User = this.userService.currentUser;
  appUser: User;
  editing = false;
  updateUserProfileForm: FormGroup;
  updateUserEmailForm: FormGroup;
  updateAppUserProfileForm: FormGroup;
  private userSubscription: Subscription;
  anonymous = `${this.userService.appBaseUrl}/assets/svg-files/icons8-anonymous-mask.svg`;

  constructor(private userService: UserService,
              private formBuilder: FormBuilder,
              private afStorage: AngularFireStorage
              ) { }

  ngOnInit(): void {
    this.getAppUser();
    this.buildUpdateUserProfileForm();
    this.buildUpdateUserEmailForm();
    this.buildUpdateAppUserProfileForm();
  }

  getAppUser(): void {
    this.userService.getUser(this.fbUser.uid)
      .subscribe(user => this.appUser = user);
  }

  private buildUpdateUserProfileForm(): void {
    this.updateUserProfileForm = this.formBuilder.group({
      displayName: [this.fbUser.displayName, [Validators.maxLength(40)]],
      photoURL: [this.fbUser.photoURL]
    });
  }

  private buildUpdateUserEmailForm(): void {
    this.updateUserEmailForm = this.formBuilder.group({
      email: [this.fbUser.email, [Validators.email]]
    });
  }

  private buildUpdateAppUserProfileForm(): void {
    this.updateAppUserProfileForm = this.formBuilder.group({
      contact: ['', [Validators.maxLength(30)]],
      secondContact: ['', [Validators.maxLength(25)]],
      userInfo: ['', [Validators.maxLength(500)]],
    });
  }

  updateUserProfile() {
    return this.userService.updateUserProfile(
      this.updateUserProfileForm.value.displayName,
      this.fbUser.photoURL
    );
  }

  updateUserEmail() {
    return this.userService.updateUserEmail(
      this.updateUserEmailForm.value.email
    );
  }

  updateAppUserContact() {
    return this.userService.updateAppUserContact(
      this.updateAppUserProfileForm.value.contact
    );
  }

  updateAppUserSecondContact() {
    return this.userService.updateAppUserSecondContact(
      this.updateAppUserProfileForm.value.secondContact
    );
  }

  updateAppUserInfo() {
    return this.userService.updateAppUserInfo(
      this.updateAppUserProfileForm.value.userInfo
    );
  }

  uploadImageURL(event) {
    const file = event.target.files[0];
    const basePath = 'users';
    const nameInStorage = `${new Date().getTime()}_${file.name}`;
    const path = `${basePath}/${this.fbUser.uid}/photos/${nameInStorage}`;
    const fileType = file.type.split('/')[0];

    if (fileType !== 'image') {
      console.error('Only images allowed :( ');
      return alert('Only images allowed :( ');
    } else {
      this.afStorage.upload(path, file)
        .then(uploadTaskSnapshot => {
          uploadTaskSnapshot.ref.getDownloadURL()
            .then(downloadURL => {
              this.userService.updateUserProfile(this.fbUser.displayName, downloadURL);
              console.log('downloadURL: ', downloadURL);
            })
            .catch((error) => console.log(error.message));
        })
        .catch((error) => console.log(error.message));
    }
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
