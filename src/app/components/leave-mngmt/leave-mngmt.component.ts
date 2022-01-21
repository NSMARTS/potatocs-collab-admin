import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/services/auth/auth.service';
import { NavService } from 'src/app/services/nav/nav.service';
import { DataService } from 'src/app/services/user/data.service';
import { ProfileService } from 'src/app/services/user/profile.service';

export interface NavItem {
	displayName: string;
	disabled?: boolean;
	iconName?: string;
	route?: string;
	children?: NavItem[];
}

@Component({
	selector: 'app-leave-mngmt',
	templateUrl: './leave-mngmt.component.html',
	styleUrls: ['./leave-mngmt.component.scss']
})
export class LeaveMngmtComponent implements OnInit, AfterViewInit {

	userProfileData;
	@ViewChild('appDrawer') appDrawer: ElementRef;
	navAdminItems: NavItem[] = [
		
		{
			displayName: 'Main',
			route: 'leave/employee-mngmt/main'
		},
		{
			displayName: 'Approval Management',
			children: [
				{
					displayName: 'Pending Company Request',
					route: 'leave/approval-mngmt/pending-request'
				}
			]
		},
		{
			displayName: 'Employee Management',
			children: [
				{
					displayName: 'Employee Leave Status',
					route: 'leave/employee-mngmt/employee-leave-status'
				},
				{
					displayName: 'Employee List',
					route: 'leave/employee-mngmt/manager-list'
				},
				// {
				// 	displayName: 'Pending Employee',
				// 	route: 'leave/employee-mngmt/pending-employee'
				// }
			]
		},
	];

	navItems

	constructor(
		private authService: AuthService,
		private router: Router,
		private profileService: ProfileService,
		private dataService: DataService,
		private navService: NavService,
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

	ngAfterViewInit() {
		this.navService.appDrawer = this.appDrawer;
	}

	logOut() {
		console.log('logout');
		this.authService.logOut();
		this.router.navigate(['']);
	}

	getUserProfileData() {
		this.dataService.userProfile.subscribe(
			(res: any) => {
				console.log('res', res.isManager);
				this.userProfileData = res;
				if(res.isAdmin){
					this.navItems = this.navAdminItems;
				}
			}
		);
	}

}
