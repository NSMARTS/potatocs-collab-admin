import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { CommonService } from 'src/@dw/services/common/common.service';
import { HolidayMngmtService } from 'src/@dw/services/corporation/holiday-mngmt.service';
import { EmployeeMngmtService } from 'src/@dw/services/employee-mngmt/employee-mngmt.service';
import { RetiredEmployeeMngmtService } from 'src/@dw/services/employee-mngmt/retired-employee-mngmt.service';
import { DataService } from 'src/@dw/store/data.service';
import { CompanyHolidayAddComponent } from '../company-holiday-add/company-holiday-add/company-holiday-add.component';


// view table
export interface PeriodicElement {
	ch_name: string;
	ch_date: string;
}

@Component({
	selector: 'app-company-holiday-list',
	templateUrl: './company-holiday-list.component.html',
	styleUrls: ['./company-holiday-list.component.scss']
})

export class CompanyHolidayListComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	// view table
	displayedColumns: string[] = ['ch_name', 'ch_date','btns'];

	// replacement day requests
	
	companyHolidayList;
	company;
	manager;
	userInfo;
	myRank;
	// dataSource = ELEMENT_DATA;
	private unsubscribe$ = new Subject<void>();

	constructor(
		public dataService: DataService,
		public dialog: MatDialog,
		private dialogService: DialogService,
		private route: ActivatedRoute,
		private holidayMngmtService: HolidayMngmtService

	) {
		this.myRank = this.route.snapshot.routeConfig.path;
	}

	ngOnInit(): void {

		this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				this.company = data;
			},
			(err: any) => {
				console.log(err);
			},
		);

		this.dataService.userManagerProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				this.manager = data;
			},
			(err: any) => {
				console.log(err);
			},
		);

		this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				this.userInfo = data;
			},
			(err: any) => {
				console.log(err);
			}
		)

		this.getCompanyHolidayList();

	}

	openAddCompanuHoliday() {
		const dialogRef = this.dialog.open(CompanyHolidayAddComponent,{
			data: {
				companyHolidayList: this.companyHolidayList
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getCompanyHolidayList();
		})
	}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	getCompanyHolidayList() {
		this.holidayMngmtService.getCompanyHolidayList().subscribe(
            (data: any) => {
				console.log(data)
                if(data.message == 'Success find company holiday'){
					this.companyHolidayList = data.findCompanyHoliday.company_holiday
				} 
            },
            (err: any) => {
                console.log(err);
            }
        )
	}

	deleteCompanyHoliday(companyHolidayId) {
		const ch_id = {
			_id: companyHolidayId
		}

		this.dialogService.openDialogConfirm('Do you want cancel this request?').subscribe((result: any) => {
			if (result) {
				this.holidayMngmtService.deleteCompanyHoliday(ch_id).subscribe( 
					(data: any) => {
						console.log(data);
						if(data.message == 'Success delete company holiday') {
							this.getCompanyHolidayList();
						}
					},
					(err: any) => {
						console.log(err);
						this.dialogService.openDialogNegative(err.error.message);
					}
				);
			}
		});
	}

	editCompanyHoliday(companyHolidayId) {
		const ch_id = {
			_id: companyHolidayId
		}

		const dialogRef = this.dialog.open(CompanyHolidayAddComponent,{
			data: {
				companyHolidayList: this.companyHolidayList
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getCompanyHolidayList();
		})

	}

}


