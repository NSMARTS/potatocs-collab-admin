import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RetiredEmployeeMngmtService {

  constructor(
    private http: HttpClient,
  ) { }

  // 퇴사시킬 직원 검색
  // Search for employee that will retire 
  searchEmployee(email){
    return this.http.get('/api/v1/admin/leave/searchEmployee', {params: email})
  }

  // 직원 퇴사 
	retireEmployee(data){
		return this.http.patch('/api/v1/admin/leave/retireEmployee', data);
	}
}
