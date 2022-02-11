import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { EmployeeMngmtService } from 'src/@dw/services/employee-mngmt/employee-mngmt.service';
import { CommonService } from 'src/@dw/services/common/common.service';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { DataService } from 'src/@dw/store/data.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RetiredEmployeeMngmtService } from 'src/@dw/services/employee-mngmt/retired-employee-mngmt.service';

// view table
export interface PeriodicElement {
	Name: string;
	position: string;
	location: string;
	annual_leave: number;
	sick_leave: number;
	replacement: number;
	start_date: Date;
	end_date: Date;
	emp_start_date: Date;
	resignation_date: Date;
}

@Component({
	selector: 'app-retired-employee-list',
	templateUrl: './retired-employee-list.component.html',
	styleUrls: ['./retired-employee-list.component.scss']
})
export class RetiredEmployeeListComponent implements OnInit {

	displayedColumns: string[] = ['name', 'email', 'emp_start_date', 'resignation_date', 'myEmployeeButton'];
	// filterValues = {};
	// filterSelectObj = [];

	getMyEmployeeList = new MatTableDataSource;

	myRank;
	managerName = '';
	company_max_day;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	private unsubscribe$ = new Subject<void>();
	isRollover = false;
	public spaceTime: string;

	constructor(
		public dialog: MatDialog,
		private employeeMngmtService: EmployeeMngmtService,
		private retiredEmployeeMngmtService: RetiredEmployeeMngmtService,
		private router: Router,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private dialogService: DialogService,
		private dataService: DataService,

	) {
		this.myRank = this.route.snapshot.routeConfig.path;
	}

	ngOnInit(): void {
		this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			async (data: any) => {
				console.log(data);

				if (!data.company_id) return;

				this.company_max_day = data.company_id.rollover_max_day
				console.log(this.company_max_day);
				if (this.company_max_day != undefined) {
					this.isRollover = true;
					this.displayedColumns = ['name', 'email', 'emp_start_date', 'resignation_date', 'myEmployeeButton'];
				}


				await this.getMyRetiredEmployeeLists();
			})
	}

	// 퇴사자 목록 출력
	getMyRetiredEmployeeLists() {
		this.managerName = '';
		this.retiredEmployeeMngmtService.getMyRetiredEmployee().subscribe(
			(data: any) => {
				if (data.message == 'found') {
					this.getMyEmployeeList.data = data.myEmployeeList;
					this.getMyEmployeeList.paginator = this.paginator;
				}
			},
			err => {
				console.log(err);
			}
		);
	}

	// filter search
	public doFilter = (value: string) => {
		this.getMyEmployeeList.filter = value.trim().toLocaleLowerCase();
	}

	// 퇴사 취소
	cancelRetireEmployee(id){
		this.retiredEmployeeMngmtService.cancelRetireEmployee(id).subscribe(()=>{
			this.getMyRetiredEmployeeLists();
		});
	}

	// 퇴사시킬 직원 검색 다이얼로그
	openDialogFindMyCompany(){
		const dialogRef = this.dialog.open(CompanyComponent, {
			width: '850px',
			height: '300px',
			data: {
				spaceTime: this.spaceTime,
			}
		});
		return dialogRef.afterClosed().subscribe(()=>{
			this.getMyRetiredEmployeeLists();
		})
	}

}



///////////////////////company

@Component({
	selector: 'app-find-company',
	templateUrl: './dialog/find-retired-employee.html',
	// styleUrls: ['./retired-employee-list.component.scss']
	styleUrls: ['./dialog/find-retired-employee.scss'],

})
export class CompanyComponent implements OnInit, OnDestroy {
	// myControl = new FormControl();
	// options: members[];
	// filteredOptions: Observable<members[]>;
	searchEmail
	displaymemberInfo
	memberInfo:any;
	spaceTime
	private destroy$ = new Subject<void>();
	displayedColumns: string[] = ['name', 'email', 'Date of entry', 'Resignation date', 'invite'];


	// auto complete
	name = new FormControl();
	employeeForm: FormGroup

	constructor(
		public dialogRef: MatDialogRef<CompanyComponent>,
		private fb: FormBuilder,
		// private spaceService: SpaceService,
		private route: ActivatedRoute,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogService: DialogService,
		private retiredEmployeeMngmtService: RetiredEmployeeMngmtService,
	) { }

	ngOnInit() {
		const startOfMonth = moment().startOf('day').format();

		this.employeeForm = this.fb.group({
			resignation_date: [startOfMonth, [
				Validators.required,
			]]
		});

	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	// 퇴사시킬 회원 검색
	searchEmployee() {
		const email = this.searchEmail;
		this.retiredEmployeeMngmtService.searchEmployee({ email }).subscribe(
			(data: any) => {
				if (data.searchEmployee == null) {
					this.dialogService.openDialogNegative(`It's a member that doesn't exist.\nPlease check email`);
					// alert(`It's a member that doesn't exist.\nPlease check email`);
				}
				else {
					this.displaymemberInfo = [data.searchEmployee];
					this.memberInfo = data.searchEmployee;
				}
			},
			(err: any) => {
				console.log(err);
			}
		)
	}

	// 퇴사자 추가
	addRetiredEmployee(id) {
		console.log(id)
		const formValue = this.employeeForm.value;
		this.dialogService.openDialogConfirm(`Do you want to retire the member?`).subscribe(result => {
			if (result) {
				this.retiredEmployeeMngmtService.retireEmployee({
					id: id,
					resignation_date : formValue.resignation_date
				}).subscribe((data)=>{
					console.log(data)
					this.dialogService.openDialogPositive('Successfully, the member has retired.')
					this.dialogRef.close();
				},
				(err: any) => {
					this.dialogService.openDialogNegative(err.error.message);
				})
			}
		});	

	}

}
