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
	tenure_today: Date;
	tenure_end: Date;
}

@Component({
	selector: 'app-retired-employee-list',
	templateUrl: './retired-employee-list.component.html',
	styleUrls: ['./retired-employee-list.component.scss']
})
export class RetiredEmployeeListComponent implements OnInit {

	displayedColumns: string[] = ['name', 'email', 'tenure_today', 'tenure_end', 'myEmployeeButton'];
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
		// public dialogRef: MatDialogRef<CompanyComponent>,
		private employeeMngmtService: EmployeeMngmtService,
		private router: Router,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private dialogService: DialogService,
		private dataService: DataService,

	) {
		// this.filterSelectObj = [
		// 	{
		// 		name: 'LOCATION',
		// 		columnProp: 'location',
		// 		options: []
		// 	},
		// 	// {
		// 	//   name: 'NAME',
		// 	//   columnProp: 'name',
		// 	//   options: []
		// 	// }, {
		// 	//   name: 'USERNAME',
		// 	//   columnProp: 'username',
		// 	//   options: []
		// 	// }, {
		// 	//   name: 'EMAIL',
		// 	//   columnProp: 'email',
		// 	//   options: []
		// 	// }, {
		// 	//   name: 'STATUS',
		// 	//   columnProp: 'status',
		// 	//   options: []
		// 	// }
		// ]
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
					this.displayedColumns = ['name', 'email', 'tenure_today', 'tenure_end', 'myEmployeeButton'];
				}


				await this.getMyEmployeeLists();
			})

		// this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
		// 	(data: any) => {
		// 		console.log(data);
		// 	}
		// )
		// this.getMyEmployeeLists();
	}

	getMyEmployeeLists() {
		this.managerName = '';
		this.employeeMngmtService.getMyEmployee().subscribe(
			(data: any) => {
				console.log(data)
				if (data.message == 'found') {

					// tenure 계산
					this.calculateTenure(data.myEmployeeList);

					// rollover 체크, company 의 rollover_max_day 로 하기.
					if (this.isRollover) {
						for (let index = 0; index < data.myEmployeeList.length; index++) {
							if (data.myEmployeeList[index].totalLeave == null) {
								console.log(11111);
							}
							else {
								data.myEmployeeList[index].totalLeave.rollover = Math.min(data.myEmployeeList[index].totalLeave.rollover, this.company_max_day);
							}
							// console.log(data.myEmployeeList[index].totalLeave.rollover);
						}
					}

					this.getMyEmployeeList.data = data.myEmployeeList;
					// this.filterSelectObj.filter((filter) => {
					// 	filter.options = this.getFilterObject(data.myEmployeeList, filter.columnProp);
					// 	console.log(filter.options);
					// });
					// console.log(this.filterSelectObj);

					// this.getMyEmployeeList.filterPredicate = this.createFilter();
					// console.log(this.getMyEmployeeList.filterPredicate);

					this.getMyEmployeeList.paginator = this.paginator;
					// console.log(this.getMyEmployeeList);
				}
			},
			err => {
				console.log(err);
				// this.dialogService.openDialogNegative(err.error.message);
				// alert(err.error.message);
			}
		);
	}

	getMyManagerEmployeeList(managerID, managerName) {
		this.managerName = managerName;
		this.employeeMngmtService.getManagerEmployee({ managerID }).subscribe(
			(data: any) => {
				console.log(data);
				console.log(data.myManagerEmployeeList);
				this.calculateTenure(data.myManagerEmployeeList);

				this.getMyEmployeeList.data = data.myManagerEmployeeList;
				// this.filterSelectObj.filter((filter) => {
				// 	filter.options = this.getFilterObject(data.myManagerEmployeeList, filter.columnProp);
				// 	console.log(filter.options);
				// });
				// console.log(this.filterSelectObj);

				this.getMyEmployeeList.paginator = this.paginator;
				console.log(this.managerName);
			},
			err => {
				console.log(err);
				this.dialogService.openDialogNegative(err.error.message);
				// alert(err.error.message);


			}
		)
	}

	calculateTenure(data) {

		for (let index = 0; index < data.length; index++) {

			var date = new Date();

			var start = this.commonService.dateFormatting(data[index].emp_start_date);
			var end = this.commonService.dateFormatting(data[index].emp_end_date);

			var startDate = moment(start, 'YYYY-MM-DD');
			var endDate = moment(end, 'YYYY-MM-DD');
			var today = moment(this.commonService.dateFormatting(date), 'YYYY-MM-DD');

			data[index].tenure_today = this.yearMonth(startDate, today)
			data[index].tenure_end = this.month(startDate, endDate)

		}

	}

	yearMonth(start, end) {

		var monthDiffToday = end.diff(start, 'months');
		if (isNaN(monthDiffToday)) {
			return '-'
		}
		var tmp = monthDiffToday
		monthDiffToday = tmp % 12;
		var yearDiffToday = (tmp - monthDiffToday) / 12;

		return yearDiffToday + ' Years ' + monthDiffToday + ' Months'

	}

	month(start, end) {

		var monthDiffToday = end.diff(start, 'months') + 1;
		if (isNaN(monthDiffToday)) {
			return '-'
		}
		// var tmp = monthDiffToday
		// monthDiffToday = tmp % 12;
		// var yearDiffToday = (tmp - monthDiffToday) / 12;

		return monthDiffToday + ' Months'

	}

	backManagerList() {
		this.router.navigate(['leave/employee-mngmt/manager-list']);
	}

	editInfo(employeeId) {
		this.router.navigate(['leave/employee-mngmt/edit-info', employeeId]);
	}





	//////////////////////////////
	// Get Uniqu values from columns to build filter
	// getFilterObject(fullObj, key) {
	// 	const uniqChk = [];
	// 	fullObj.filter((obj) => {
	// 		if (!uniqChk.includes(obj[key])) {
	// 			uniqChk.push(obj[key]);
	// 		}
	// 		console.log(obj);
	// 		return obj;
	// 	});
	// 	console.log(uniqChk);
	// 	return uniqChk;
	// }

	// Called on Filter change
	// filterChange(filter, event) {
	// 	//let filterValues = {}
	// 	this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase()
	// 	this.getMyEmployeeList.filter = JSON.stringify(this.filterValues);
	// 	console.log(this.filterValues);
	// 	console.log(this.getMyEmployeeList.filter);
	// }

	// Custom filter method fot Angular Material Datatable
	// createFilter() {
	// 	console.log('createFilter');
	// 	let filterFunction = function (data: any, filter: string): boolean {
	// 		let searchTerms = JSON.parse(filter);
	// 		let isFilterSet = false;
	// 		console.log(isFilterSet);
	// 		for (const col in searchTerms) {
	// 			if (searchTerms[col].toString() !== '') {
	// 				isFilterSet = true;
	// 				console.log(isFilterSet);
	// 			} else {
	// 				delete searchTerms[col];
	// 			}
	// 		}

	// 		console.log(searchTerms);

	// 		let nameSearch = () => {
	// 			let found = false;
	// 			if (isFilterSet) {
	// 				for (const col in searchTerms) {
	// 					searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
	// 						if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
	// 							found = true
	// 						}
	// 					});
	// 				}
	// 				return found
	// 			} else {
	// 				return true;
	// 			}
	// 		}
	// 		return nameSearch()
	// 	}
	// 	return filterFunction
	// }


	// Reset table filters
	// resetFilters() {
	// 	this.filterValues = {}
	// 	this.filterSelectObj.forEach((value, key) => {
	// 		value.modelValue = undefined;
	// 	})
	// 	this.getMyEmployeeList.filter = "";
	// }

	///// filter search
	public doFilter = (value: string) => {
		this.getMyEmployeeList.filter = value.trim().toLocaleLowerCase();
	}



	// 회사
	openDialogFindMyCompany(): Observable<boolean> {

		const dialogRef = this.dialog.open(CompanyComponent, {
			width: '850px',
			height: '300px',
			data: {
				spaceTime: this.spaceTime,
			}
		});

		return dialogRef.afterClosed();
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
	memberInfo = [];
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
		this.spaceTime = this.data.spaceTime;
		console.log(this.spaceTime);


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
				console.log(data);
				if (data.searchEmployee == null) {
					this.dialogService.openDialogNegative(`It's a member that doesn't exist.\nPlease check email`);
					// alert(`It's a member that doesn't exist.\nPlease check email`);
					
				}
				else {
					this.memberInfo = [data.searchEmployee];
					this.displaymemberInfo = this.memberInfo;
					console.log(this.memberInfo)
					console.log(this.displaymemberInfo);
				}
			},
			(err: any) => {
				console.log(err);
			}
		)
	}

	myEmployeeLeaveListSearch() {
		const formValue = this.employeeForm.value;
		this.dialogService.openDialogConfirm(`Do you want to retire the member?`).subscribe(result => {
			if (result) {
				this.retiredEmployeeMngmtService.retireEmployee({
					id: this.displaymemberInfo[0]._id,
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
		// 은퇴일
	

	}

	inviteSpaceMember() {
		// const result = confirm(`Do you want to invite?`);
		// if (result) {
		this.dialogService.openDialogConfirm(`Do you want to invite the member?`).subscribe(result => {
			console.log(result)
			if (result) {
				// console.log(member._id);
				// console.log('inviteSpaceMember');
				// const data = {
				// 	member_id: member._id,
				// 	spaceTime: this.spaceTime
				// }
				// console.log(data);
				// this.spaceService.inviteSpaceMember(data).subscribe(
				// 	(data: any) => {
				// 		// console.log(data);
				// 		this.dialogService.openDialogPositive('Successfully, the member has invited.');
				// 		// alert('Successfully, invited.');
				// 		this.displaymemberInfo = '';
				// 		this.searchEmail = '';
				// 		this.reUpdateMembers();
				// 	},
				// 	(err: any) => {
				// 		// console.log(err);
				// 		this.displaymemberInfo = '';
				// 		this.searchEmail = '';
				// 		this.dialogService.openDialogNegative(err.error.message);
				// 	}
				// )
			}
		});
	}
	// clearMember(){
	// 	this.displaymemberInfo =[];
	// }

	reUpdateMembers() {
		console.log(this.spaceTime);
		// this.spaceService.getSpaceMembers(this.spaceTime).subscribe(
		// 	(data: any) => {
		// 		console.log(data)
		// 	},
		// 	(err: any) => {
		// 		console.log('spaceService error', err);
		// 	}
		// );
	}


	
}
