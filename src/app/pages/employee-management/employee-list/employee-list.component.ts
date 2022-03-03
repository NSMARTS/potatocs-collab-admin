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
import { empty, Subject } from 'rxjs';
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

    displayedColumns: string[] = ['name', 'annual_leave', 'sick_leave', 'replacementday_leave', 'start_date', 'editButton', 'myEmployeeButton'];
    // filterValues = {};
    // filterSelectObj = [];

    getMyEmployeeList = new MatTableDataSource;

    myRank;
    managerName = '';
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private unsubscribe$ = new Subject<void>();
    isRollover: Boolean;
    myCompanyInfo;


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
                if (!data.company_id) return;
                this.myCompanyInfo = data.company_id;
                if (this.myCompanyInfo.rollover != false) {
                    this.displayedColumns = ['name', 'annual_leave', 'rollover', 'sick_leave', 'replacementday_leave', 'start_date', 'editButton', 'myEmployeeButton'];
                }


                this.getMyEmployeeLists();
            })
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
                                data.myEmployeeList[index].totalLeave.rollover = Math.min(data.myEmployeeList[index].totalLeave.rollover, this.myCompanyInfo.rollover_max_day);
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
                this.calculateTenure(data.myManagerEmployeeList);
                this.getMyEmployeeList.data = data.myManagerEmployeeList;
                // this.filterSelectObj.filter((filter) => {
                // 	filter.options = this.getFilterObject(data.myManagerEmployeeList, filter.columnProp);
                // 	console.log(filter.options);
                // });
                // console.log(this.filterSelectObj);
                this.getMyEmployeeList.paginator = this.paginator;

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
            const data = <any[]>this.excelSrv.importFromFile(bstr);
            const header: string[] = Object.getOwnPropertyNames(new Contact());
            const importedData = data.slice(1);
            this.importContacts = importedData.map(arr => {
                const obj = {};
                for (let i = 0; i < header.length; i++) {
                    const k = header[i];
                    obj[k] = arr[i];
                }
                return <Contact>obj;
            })
            
            // 임포트한 엑셀 데이터에 행이 비어있는 경우 삭제, 비어있으 행이 없는 새로운 배열 생성
            this.importContacts = this.importContacts.filter(data =>
				    !((data.name == '' || data.name == null) && 
                    (data.email == '' || data.email == null) && 
				    (data.emp_start_date == '' || data.emp_start_date == null) &&
                    (data.department == '' || data.department == null) &&
                    (data.position == '' || data.position == null) &&
                    (data.emp_end_date == '' || data.emp_end_date == null) &&
                    (data.managerId == '' || data.managerId == null)) 
			)

            // 임포트한 엑셀 데이터에 반드시 있어야하는 값이 빈값이 있는 경우 찾기
            let filteredImportedData = this.importContacts.filter(data =>
            ((data.email == '' || data.email == null) ||
                (data.emp_start_date == '' || data.emp_start_date == null))
            )
            
            if (filteredImportedData.length > 0) {
                return this.dialogService.openDialogNegative('There is an empty value on required inputs with (*). Check the excel file.');
            } 

            // 임포트한 엑셀 데이터 중 emp_start_date의 셀의 표시형식이 '일반'이 아닌 '날짜' 일 경우
            // 자동적으로 5자리 숫자로 변경되어진다. 만약 그럴경우 원래 날짜로 바꿔주는 작업
            // https://stackoverflow.com/questions/1703505/excel-date-to-unix-timestamp/6154953#6154953   // 엑셀 날짜 계산식
            // https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript // 유닉스 날짜 계산식
            this.importContacts.forEach(element => {
                if (element.emp_start_date.toString().length == 5 && typeof (element.emp_start_date) == 'number') {
                    element.emp_start_date = this.ExcelDateToJSDate(element.emp_start_date)
                }
            });


            this.employeeMngmtService.importEmployeeList(this.importContacts).subscribe(async (data: any) => {
                if (data.message == 'success') {
                    this.dialogService.openDialogPositive('Successfully, the file information has been uploaded.');
                }
                this.getMyEmployeeLists();
            }, err => {
                console.log(err.error);
                this.errorAlert(err.error.message);
            })

        };
        reader.readAsBinaryString(target.files[0]);



    }

    errorAlert(err) {
        switch (err) {
            case 'not found email': // 엑셀에 입력된 이메일이 없으면
                this.dialogService.openDialogNegative('Cannot find a email.');
                break;
            case 'not found emp_start_date': // 엑셀에 입력된 계약시작일이 없으면
                this.dialogService.openDialogNegative('Start Date must required');
                break;
            case 'not match date': // 엑셀에 입력된 계약시작일 형식이 잘못됐거나, 셀의 표시형식이 '일반'이 아닌 '날짜'인 경우 
                this.dialogService.openDialogNegative("The format of the start date is wrong. Please, change the type 'Short Date' to 'General'");
                break;
            case 'found retired manager': // 엑셀에 입력된 매니저 ID가 퇴사자이면
                this.dialogService.openDialogNegative('Found a retired manager.');
                break;
            case 'not found manager id': // 엑셀에 입력된 매니저 ID가 Member DB에 없으면 
                this.dialogService.openDialogNegative('Cannot find a manager.');
                break;
            case 'not found Member': // 엑셀에 입력된 아이디가 DB에 없거나, 회원가입된 아이디가 아니면 에러 메시지
                this.dialogService.openDialogNegative('Cannot find a member');
                break;
            case 'found retired Employee':  // 엑셀에 입력된 아이디가 퇴사자면
                this.dialogService.openDialogNegative('Found a retired member');
                break;
            case 'Cannot update Member': // 회원정보 업데이트 실패
                this.dialogService.openDialogNegative('An error has occurred.');
                break;
            case 'failed': // 서버에러
                this.dialogService.openDialogNegative('An error has occurred in the server');
                break;
        }

    };

    exportFormat() {
        this.excelSrv.exportToFile('');
    }

    exportData() {
        this.excelSrv.exportToFile(this.getMyEmployeeList.data);
    }
    /////////////////////////////////////////////////////////////////

    // 엑셀의 셀 중 표시형식이 Date인경우 데이터가 5자리 숫자로 바뀐다.
    // 원래 날자로 바꿔주는 코드
    // https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript
    ExcelDateToJSDate(serial) {
        var utc_days = Math.floor(serial - 25569);
        var utc_value = utc_days * 86400;
        var date_info = new Date(utc_value * 1000).toISOString().slice(0, 10);
        // var date = moment(new Date(utc_value * 1000)); //Pass in unix timestamp instead of Excel date
        // var date_info = date.format('YYYY-MM-DD');
        return date_info;
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

}
