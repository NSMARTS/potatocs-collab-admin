import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LeaveMngmtService } from 'src/app/services/leave/leave-mngmt/leave-mngmt.service';
import { AdminMainService } from 'src/app/services/admin/admin-main/admin-main.service';
// table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// view table
export interface PeriodicElement {
	createAt: Date;
	leaveStartDate: Date;
	duration: number;
	leaveType: string;
	approver: string;
	status: string
}

// const ELEMENT_DATA: PeriodicElement[] = [
// 	{ createAt: 1, leaveStartDate: 'Hydrogen', duration: 1.0079, leaveType: 'H' ,approver:'g',status:'approve'},
// 	{ createAt: 2, leaveStartDate: 'Helium', duration: 4.0026, leaveType: 'He' ,approver:'g',status:'approve'},
// 	{ createAt: 3, leaveStartDate: 'Lithium', duration: 6.941, leaveType: 'Li' ,approver:'g',status:'approve'},
// ];

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

	currentDate = new Date();

	// view table
	displayedColumns: string[] = ['createAt', 'leaveStartDate', 'duration', 'leaveType', 'approver', 'status'];
	// dataSource = ELEMENT_DATA;

	// 휴가 변수들
	countCompanyEmployee;
	countPendingCompany;
	userReplacementLeaveStatus;	
	leaveInfo;
	
	// 3개월 전부터 지금까지 신청한 휴가 변수
	threeMonthBeforeLeaveList;
	viewType = {
		'annual_leave': 'Annual Leave',
		'sick_leave': 'Sick Leave',
		'replacementday_leave': 'Replacement Day'
	}
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private leaveMngmtService: LeaveMngmtService,
		private adminMainService : AdminMainService
	) { }

	ngOnInit(): void {


		this.adminMainService.getAdminMain().subscribe(
			(data: any) => {
				console.log(data);
				this.countCompanyEmployee = data.countCompanyEmployee
				this.countPendingCompany = data.countPendingCompany
			},
			(err: any) => {
				console.log(err);
			}
		)
		
	}

	// 휴가 리스트 페이지 만들기

	
	
	
	 
}
