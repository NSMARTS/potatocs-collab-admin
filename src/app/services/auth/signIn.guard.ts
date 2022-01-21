import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DialogService } from '../admin/dialog/dialog.service';
import { AuthService } from './auth.service';

@Injectable()
export class SignInGuard implements CanActivate, OnInit {

	constructor(
		private router: Router,
		private auth: AuthService,
		private dialogService: DialogService
		) {

	}

	ngOnInit() {
		console.log('auth guard oninit');
	}
	
	// https://stackoverflow.com/questions/42719445/pass-parameter-into-route-guard
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		// 토큰 만료 혹은 종료 시 login page로 돌아감.
		const routePath = route.routeConfig.path;
		if (!this.auth.isAuthenticated()) {
			// console.log('Invalid Token');
			if (routePath == '' || routePath == 'sign-in' || routePath == 'sign-up') {
				return true;
			} else {
				this.dialogService.openDialogNegative('Please login first');
				// this.router.navigate(['sign-in']);
			}
			
			return true;
		} else {
			// console.log(routePath);
			// alert('already signed in');
			if (routePath == 'sign-in') {
				this.router.navigate(['leave']);
				return true;
			} else if (routePath == '') {
				this.router.navigate(['leave']);
				return true;
			} else {
				return true;
			}
		}
	}
}
