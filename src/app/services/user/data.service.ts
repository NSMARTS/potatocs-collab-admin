import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	private userProfileSubject = new BehaviorSubject({});
	userProfile = this.userProfileSubject.asObservable();

	constructor( 
		
	) {

	}

	updateUserProfile(profileData: any) {
		// console.log('updatedData', profileData);
		this.userProfileSubject.next(profileData);
	}
}