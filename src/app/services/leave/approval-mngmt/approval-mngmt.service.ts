import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ApprovalMngmtService {

	constructor(
		private http: HttpClient,
	) { }

	getLeaveRequest() {
		return this.http.get('/api/v1/leave/pending-leave-request');
	}

	approvedLeaveRequest(id) {
		return this.http.put('/api/v1/leave/approve-leave-request', { id });
	}

}