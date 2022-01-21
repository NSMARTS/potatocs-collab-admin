import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { DataService } from '../../store/data.service';

@Injectable({
	providedIn: 'root'
})
export class ProfileService {

	constructor(
		private http: HttpClient,
		private dataService: DataService,
	) { }

	getUserProfile() {
		return this.http.get('/api/v1/admin/profile')
		.pipe(
			shareReplay(),
			tap( 
				(res: any) => {
					if(res.profile_img == ""){
						res.profile_img = '/assets/image/person.png'
					}

					this.dataService.updateUserProfile(res);
				}
			)
		);
	}
	changeUserProfile(data) {
		return this.http.put('/api/v1/admin/profileChange', data);
	}
	
	changeProfileImage(imgFile){
		const imgData = new FormData();
		imgData.append('file', imgFile);
		return this.http.post('/api/v1/admin/profileImageChange', imgData);
	}
}
