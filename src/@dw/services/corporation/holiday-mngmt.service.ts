import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HolidayMngmtService {

  constructor(
    private http: HttpClient,
  ) { }

  getCompanyHolidayList(){
    return this.http.get('/api/v1/admin/leave/getCompanyHolidayList');
  }

  addCompanyHoliday(companyHolidayData){
    return this.http.post('/api/v1/admin/leave/addCompanyHoliday', companyHolidayData);
  }

  deleteCompanyHoliday(companyHolidayId){
    return this.http.post('/api/v1/admin/leave/deleteCompanyHoliday', companyHolidayId);
  }
}
