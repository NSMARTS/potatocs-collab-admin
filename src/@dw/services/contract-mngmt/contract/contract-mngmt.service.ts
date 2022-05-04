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

    // save contract
    saveContract(data) {
        return this.http.post('/api/v1/admin/contract/saveContract', data);
    }

    // get contract list 
    getContractList(data) {
        return this.http.get('/api/v1/admin/contract/getContractList', {params: data});
    }


    // pdf 불러오기
    getContractInfo(data) {
        return this.http.get('/api/v1/admin/contract/getContractInfo/',{ params:data});
    }


    getPdfFile(data) {
        return this.http.get('/api/v1/admin/contract/getPdfFile/',{ params:data, responseType: 'blob' });
    }
}
