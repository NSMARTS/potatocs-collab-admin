import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/user/data.service';
import { ProfileService } from 'src/app/services/user/profile.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent implements OnInit {

  userProfileData;
  userProfileSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe(
      (data: any) => {
        if (data.result) {
          this.getUserProfileData();
        }
      }
    );
  }

  logOut() {
    console.log('logout');
    this.authService.logOut();
    this.router.navigate(['']);
  }

  getUserProfileData() {
    this.userProfileSubscription = this.dataService.userProfile.subscribe(
      (res: any) => {
        // console.log('In');
        this.userProfileData = res;
      }
    );
  }

}
