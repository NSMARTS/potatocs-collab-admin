import { Component, OnInit, ViewChild } from '@angular/core';

// table page
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from 'src/@dw/dialog/dialog.service';

// Service
import { MainService } from 'src/@dw/services/main/main.service';

// view table
export interface PeriodicElement {
	createAt: Date;
	leaveStartDate: Date;
	duration: number;
	leaveType: string;
	approver: string;
	status: string
}

@Component({
	selector: 'app-main',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {

	currentDate = new Date();

	// view table
	displayedColumns: string[] = ['createAt', 'leaveStartDate', 'duration', 'leaveType', 'approver', 'status'];

	// 휴가 변수들
	countCompanyEmployee;
	countPendingCompany;
	userReplacementLeaveStatus;	
	leaveInfo;
	
	// 3개월 전부터 지금까지 신청한 휴가 변수
	threeMonthBeforeLeaveList;
	viewType = {
		'annual_leave': 'Annual Leave',
		'rollover': 'Rollover',
		'sick_leave': 'Sick Leave',
		'replacementday_leave': 'Replacement Day'
	}
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private adminMainService : MainService,
        private dialogService: DialogService,

	) { }

	ngOnInit(): void {

		this.adminMainService.getAdminMain().subscribe(
			(data: any) => {
				if(data.message == 'not found') {
					this.countCompanyEmployee = 0;
					this.countPendingCompany = 0;
				} else {
					this.countCompanyEmployee = data.countCompanyEmployee
					this.countPendingCompany = data.countPendingCompany
				}
				
			},
			(err: any) => {
				console.log(err.error);
				this.errorAlert(err.error.message);
			}
		)
		
	}

	errorAlert(err) {
		switch(err) {
			case 'not found':
				this.countCompanyEmployee = 0;
				this.countPendingCompany = 0;
				break;
		}
	};
	 
}
