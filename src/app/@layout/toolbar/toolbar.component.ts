import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../@dw/services/layout.service'
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/@dw/services/auth/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/@dw/services/user/profile.service';
import { DataService } from 'src/@dw/store/data.service';
import {  takeUntil } from 'rxjs/operators';

@Component({
  selector: 'po-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

	userProfileData;
	notiItems = [
		{
		  notiType: 'leave-request',
		  isRead: false,
		  iconText: 'open_in_browser',
		  notiLabel: 'A new leave request received'
		},
		{
		  notiType: 'company-request',
		  isRead: false,
		  iconText: 'work_outline',
		  notiLabel: 'A new company request received'
		},
		{
		  notiType: 'company-res-y',
		  isRead: false,
		  iconText: 'done_outline',
		  notiLabel: 'The company request has been accepted'
		},
		{
		  notiType: 'leave-res-n',
		  isRead: false,
		  iconText: 'block',
		  notiLabel: 'The leave request has been rejected'
		},
		{
		  notiType: 'company-res-n',
		  isRead: false,
		  iconText: 'block',
		  notiLabel: 'The company request has been rejected'
		},
		{
		  notiType: 'leave-request',
		  isRead: false,
		  iconText: 'open_in_browser',
		  notiLabel: 'A new leave request received'
		},
		{
		  notiType: 'leave-res-y',
		  isRead: false,
		  iconText: 'done_outline',
		  notiLabel: 'A new leave request has been accepted'
		},
		{
		  notiType: 'leave-request',
		  isRead: false,
		  iconText: 'open_in_browser',
		  notiLabel: 'A new leave request received'
		},
		{
		  notiType: 'leave-request',
		  isRead: false,
		  iconText: 'open_in_browser',
		  notiLabel: 'A new leave request received'
		},
		{
		  notiType: 'leave-request',
		  isRead: false,
		  iconText: 'open_in_browser',
		  notiLabel: 'A new leave request received'
		}
	]
	private unsubscribe$ = new Subject<void>();

  constructor(
    private layoutService: LayoutService,
	private authService: AuthService,
    private router: Router,
    private profileService: ProfileService,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
	this.profileService.getUserProfile().subscribe(
		(data: any) => {
				this.getUserProfileData();

		}
	);
  }

  ngOnDestroy() {
    // unsubscribe all subscription
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }


  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }

  getUserProfileData() {
	this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
		(res: any) => {
			this.userProfileData = res;
		}	
	);
  }
  /**
   * open side nav
   */
  openSidenav() {
    this.layoutService.openSidenav();
  }


}
