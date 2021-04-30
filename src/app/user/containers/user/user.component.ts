import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { getUser, getUserLoading, State } from '@root/reducers';
import { UserActions } from '@user/actions';
import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent {
  loading$ = this.store.pipe(select(getUserLoading));
  email = '';
  createdAt = '';
  picture = '';
  nickname = new FormControl('', Validators.required);

  constructor(private readonly store: Store<State>) {
    this.store.pipe(select(getUser)).subscribe(({ nickname, picture, created_at, email }) => {
      this.createdAt = moment(created_at).format('LLLL');
      this.picture = picture;
      this.nickname.patchValue(nickname);
      this.email = email;
    });
  }

  update() {
    this.store.dispatch(UserActions.update({ user: { nickname: this.nickname.value } }));
  }

  upload(event: any) {
    const reader = new FileReader();
    const [file] = event.target.files;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.store.dispatch(UserActions.upload({ file }));
    };
  }
}
