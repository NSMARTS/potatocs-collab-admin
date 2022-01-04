import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
	providedIn: 'root'
})
export class ProfileService {

	constructor(
		private http: HttpClient,
		private dataService: DataService,
	) { }

	/**
	 * student profile 받아오기
	 */
	getUserProfile() {
		return this.http.get('/api/v1/user/profile')
		.pipe(
			tap( 
				(res: any) => {
					// console.log('profile Service Result', res);
					this.dataService.updateUserProfile(res.user);
					res.result = true;
				}
			)
		);
	}
	changeUserProfile(data) {
		return this.http.put('/api/v1/user/profileChange', data);
	}
	changeProfileImage(imgFile){
		const imgData = new FormData();
		imgData.append('file', imgFile);
		console.log()
		return this.http.post('/api/v1/user/profileImageChange', imgData);
	}
}
