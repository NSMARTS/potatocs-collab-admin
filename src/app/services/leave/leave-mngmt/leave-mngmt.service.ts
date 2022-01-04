import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class LeaveMngmtService {

	constructor(
		private http: HttpClient,
	) { }

	/* -----------------------------------------------
		Request Leave Component
	----------------------------------------------- */
	requestLeave(leaveData) {
		return this.http.post('/api/v1/leave/request-leave', leaveData);
	}

	/* -----------------------------------------------
		Main Component
	----------------------------------------------- */
	getMyLeaveStatus() {
		return this.http.get('/api/v1/leave/my-status');
	}

	/* -----------------------------------------------
		Main Component
	----------------------------------------------- */
	getMyLeaveList() {
		return this.http.get('/api/v1/leave/my-request');
	}

	/* -----------------------------------------------
		Request Leave List Component
	----------------------------------------------- */
	getMyLeaveListSearch(data){
		return this.http.get('/api/v1/leave/my-request-search', { params: data });
	}
}	