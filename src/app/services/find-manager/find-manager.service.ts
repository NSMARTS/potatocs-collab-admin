import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class FindManagerService {

	constructor(
		private http: HttpClient,
	) { }

	/**
	 * Find My Manager	 * 
	 * @param _id a manager's email id
	 */
	findManager(_id) {
		return this.http.get('/api/v1/leave/find-manager/' + _id);
	}

	addManager(_id) {
		return this.http.post('/api/v1/leave/add-manager', { manager_id: _id });
	}

	getManagerInfo() {
		return this.http.get('/api/v1/leave/get-manager');
	}

	cancelPending(id) {
		return this.http.delete('/api/v1/leave/cancel-pending/' + id);
	}
	deletePending(id){
		return this.http.delete('/api/v1/leave/delete-my-manager/' + id);
	}

}
