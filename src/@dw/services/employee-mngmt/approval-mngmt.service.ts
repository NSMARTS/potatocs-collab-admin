import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { CompanyRequestStorageService } from './company-request-storage.service';


@Injectable({
	providedIn: 'root'
})
export class ApprovalMngmtService {

	constructor(
		private http: HttpClient,
		private companyRequestStorageService: CompanyRequestStorageService,
	) { }

	getCompanyRequest() {
		return this.http.get('/api/v1/admin/leave/getPendingRequest')
		.pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					this.companyRequestStorageService.updatePendingRequest(res.pendingRequestData);
					return res.message;
				}
			)
		);
	}

	approveCompanyRequest(sendData) {
		return this.http.put('/api/v1/admin/leave/approveRequest', sendData)
		.pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					this.companyRequestStorageService.updatePendingRequest(res.pendingRequestData);
					return res.message;
				}
			)
		);
	}

	deleteCompanyRequest(pedingId){
		return this.http.delete('/api/v1/admin/leave/deleteRequest', { params: pedingId })
		.pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					this.companyRequestStorageService.updatePendingRequest(res.pendingRequestData);
					return res.message;
				}
			)
		);
	}
}