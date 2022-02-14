import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Subject } from 'rxjs';
import { ExcelService } from 'src/@dw/services/excel/excel.service';
import { Contact } from './models/contact.model';

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
	selector: 'app-employee-list',
	templateUrl: './employee-list.component.html',
	styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

	displayedColumns: string[] = ['name', 'position', 'location', 'annual_leave', 'sick_leave', 'replacementday_leave', 'start_date', 'end_date', 'tenure_today', 'tenure_end', 'editButton', 'myEmployeeButton'];
	// filterValues = {};
	// filterSelectObj = [];

	getMyEmployeeList = new MatTableDataSource;

	myRank;
	managerName = '';
	company_max_day;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	private unsubscribe$ = new Subject<void>();
	isRollover = false;


    // excel
    importContacts: Contact[] = [];
    exportContacts: Contact[] = [];

	constructor(
		private employeeMngmtService: EmployeeMngmtService,
		private router: Router,
		private route: ActivatedRoute,
		private commonService: CommonService,
		private dialogService: DialogService,
		private dataService: DataService,
        private excelSrv: ExcelService

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
					this.displayedColumns = ['name', 'position', 'location', 'annual_leave', 'rollover', 'sick_leave', 'replacementday_leave', 'start_date', 'end_date', 'tenure_today', 'tenure_end', 'editButton', 'myEmployeeButton'];
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
				if (data.message == 'found') {

					// tenure 계산
					this.calculateTenure(data.myEmployeeList);

					// rollover 체크, company 의 rollover_max_day 로 하기.
					if (this.isRollover) {
						for (let index = 0; index < data.myEmployeeList.length; index++) {
							if (data.myEmployeeList[index].totalLeave == null) {
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
                    console.log(this.getMyEmployeeList.data)
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

    /////////////////////////////////////////////////////////////////
	// excel import 
	onFileChange(evt: any) {
		const target: DataTransfer = <DataTransfer>(evt.target);
		if (target.files.length !== 1) throw new Error('Cannot use multiple files');

		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {

			const bstr: string = e.target.result;
			console.log(bstr)
			const data = <any[]>this.excelSrv.importFromFile(bstr);
			console.log(data)
			const header: string[] = Object.getOwnPropertyNames(new Contact());
			console.log(header)
			const importedData = data.slice(1);
			console.log(importedData)
			this.importContacts = importedData.map(arr => {
				const obj = {};
				for (let i = 0; i < header.length; i++) {
					const k = header[i];
					obj[k] = arr[i];
				}
				return <Contact>obj;
			})
			console.log(this.importContacts)
		};
		reader.readAsBinaryString(target.files[0]);

	}

    exportData() {
        this.excelSrv.exportToFile('');
    }

    exportFormat(){
        this.excelSrv.exportToFile(this.getMyEmployeeList.data);
    }
    /////////////////////////////////////////////////////////////////




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

}
