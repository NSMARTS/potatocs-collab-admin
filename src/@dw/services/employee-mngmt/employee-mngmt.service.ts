import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class EmployeeMngmtService {

  constructor(
    private http: HttpClient,
  ) { }

  // admin Employee List 나오는 부분
  getMyEmployee(){
    return this.http.get('/api/v1/admin/leave/getMyEmployee');
  }

  // admin Employee List 에서 employee 누르면 되는 부분 
  getManagerEmployee(managerID){
    return this.http.get('/api/v1/admin/leave/getManagerEmployee', { params: managerID });
  }

  // edit 눌렀을때 정보 가져오기
  getEmployeeInfo(id) {
		return this.http.get('/api/v1/admin/leave/getEmployeeInfo/' + id);
	}

  // edit-info 에서 Edit Profile 에 있는 edit을 누르면 
  putEmployeeProfileInfo(sendData) {
		return this.http.put('/api/v1/admin/leave/editEmployeeProfileInfo', sendData);
	}

  putEmployeeLeaveInfo( sendData ) {
    return this.http.put('/api/v1/admin/leave/editEmployeeLeaveInfo', sendData);
  }

  // admin employee leave status 부분
  getEmployeeLeaveListSearch(data){
		return this.http.get('/api/v1/admin/leave/employeeLeaveListSearch',{ params: data });
	}

}
