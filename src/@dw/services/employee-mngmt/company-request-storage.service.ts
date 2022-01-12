import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyRequestStorageService {

	private requestDataSubject$: BehaviorSubject<any>;
	requestData: Observable<any>;

	constructor() { 
		this.requestDataSubject$ = new BehaviorSubject([]);
		this.requestData = this.requestDataSubject$.asObservable();
	}

	updatePendingRequest(pendingData: any) {
		this.requestDataSubject$.next(pendingData);
	}






	
}
