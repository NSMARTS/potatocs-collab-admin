import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

	sideNavFlag: boolean;

	private menuDataSubject$ = new BehaviorSubject({});
	menuData$ = this.menuDataSubject$.asObservable();

	constructor(
		private http: HttpClient
	) { }

	// need to update for admin only
	updateSideMenu() {
		return this.http.get('/api/v1/collab/update-side-menu');
	}

	updateMenuData(menuData: any) {
		this.menuDataSubject$.next(menuData);
	}

	setTrueForSideNavFlag() {
		this.sideNavFlag = true;
	}

	setFalseForSideNavFlag() {
		this.sideNavFlag = false;
	}
}






