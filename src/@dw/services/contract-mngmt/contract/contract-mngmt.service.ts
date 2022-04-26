import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ContractMngmtService {

    constructor(
        private http: HttpClient,
    ) {}



    // get employee list 
    getEmployeeList() {
        return this.http.get('/api/v1/admin/contract/getEmployeeList');
    }

    // get employee list 
    saveContract(data) {
        return this.http.post('/api/v1/admin/contract/saveContract', data);
    }
}
