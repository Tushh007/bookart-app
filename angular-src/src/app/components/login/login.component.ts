import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: String = '';
  password: String = '';
  authData: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}

  ngOnInit(): void {}

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password,
    };

    this.authService.authenticateUser(user).subscribe((data) => {
      this.authData = data;
      if (this.authData.success) {
        this.authService.storeUserData(this.authData.token, this.authData.user);
        this.flashMessage.show('You are now logged in', {
          cssClass: 'alert-success',
          timeout: 5000,
        });
        this.router.navigate(['/dashboard'])
      } else {
        this.flashMessage.show(this.authData.msg, {
          cssClass: 'alert-danger',
          timeout: 5000,
        });
        this.router.navigate(['/login'])
      }
    });
  }
}
