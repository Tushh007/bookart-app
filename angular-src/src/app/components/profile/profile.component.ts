import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any;
  profile: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.authService.getProfile().subscribe(
      (profile) => {
        this.profile = profile;
        this.user = this.profile.user;
        console.log(this.user);
      },
      (err) => {
        console.log(err);
        return false;
      }
    );
  }
}
