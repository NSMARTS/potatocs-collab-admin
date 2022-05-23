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

    // search contractor
    searchContractor(email) {
        return this.http.get('/api/v1/admin/contract/searchContractor', { params: email})
    }

    // save contract
    saveContract(data) {
        return this.http.post('/api/v1/admin/contract/saveContract', data);
    }

    // get contract list 
    getContractList() {
        return this.http.get('/api/v1/admin/contract/getContractList');
    }


    // pdf 상세 정보 불러오기
    getContractInfo(data) {
        return this.http.get('/api/v1/admin/contract/getContractInfo/',{ params:data});
    }

    // 업로드 시 PDF File 정보 요청
    getPdfFile(data) {
        return this.http.get('/api/v1/admin/contract/getPdfFile/',{ params:data, responseType: 'blob' });
    }

    // confirm sign
    signContract(data) {
        console.log(data)
        return this.http.post('/api/v1/admin/contract/signContract', data);
    }

    // reject contract
    rejectContract(data) {
        return this.http.post('/api/v1/admin/contract/rejectContract', data);
    }

    // search my contract list
    getContractListSearch(data) {
        return this.http.get('/api/v1/admin/contract/getContractListSearch', { params: data });
    }
}
