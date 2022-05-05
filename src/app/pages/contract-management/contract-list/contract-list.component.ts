import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContractMngmtService } from 'src/@dw/services/contract-mngmt/contract/contract-mngmt.service';
import { DataService } from 'src/@dw/store/data.service';



export interface PeriodicElement {
    startDate: Date;
    endDate: Date;
    name: string;
    leaveType: string;
    duration: number;
    email: string;
}

export interface Employees {
    _id: string;
    name: string;
    email: string;
}

@Component({
    selector: 'app-contract-list',
    templateUrl: './contract-list.component.html',
    styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {


    userInfo;



    contractList = new MatTableDataSource;

    private unsubscribe$ = new Subject<void>();

    // auto complete
    myControl = new FormControl();
    options: Employees[];
    filteredOptions: Observable<Employees[]>;

    // view table
    displayedColumns: string[] = ['date', 'title', 'description', 'sender', 'receiver', 'status',];
    dataSource

    employeeForm: FormGroup


    searchStr = '';

    viewType = {
        'pending': 'Pending',
        'proceeding': 'Proceeding',
        'complete': 'Complete',
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private contractMngmtService: ContractMngmtService,
        public dataService: DataService,
    ) { }

    ngOnInit(): void {

        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            async (data: any) => {
                this.userInfo = data;

                if (this.userInfo.company_id != undefined) {
                    this.getContractList();
                }
            },
            (err: any) => {
                console.log(err);
            }
        )

        const startOfMonth = moment().startOf('month').format();
        const endOfMonth = moment().endOf('month').format();

        this.employeeForm = this.fb.group({
            type: ['all', [
                Validators.required,
            ]],
            leave_start_date: [startOfMonth, [
                Validators.required,
            ]],
            leave_end_date: [endOfMonth, [
                Validators.required,
            ]],
            emailFind: ['', [
                Validators.required,
            ]]
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    uploadRouting() {
        this.router.navigate(['/leave/contract-mngmt/contract-upload']);
    }


    // 계약서 가져오기
    getContractList() {

        const data = {
            company_id: this.userInfo.company_id._id
        }

        this.contractMngmtService.getContractList(data).subscribe((data: any) => {
            if (data.message == 'Success find document list') {
                this.contractList = data.documentList
            }

            this.contractList = new MatTableDataSource<PeriodicElement>(data.contractList);
            this.contractList.paginator = this.paginator;
        },
            (err: any) => {
                console.log(err);
            }
        )
    }


    // Go to the page where you sign a contract
    openContractSignPage(data) {
        this.router.navigate([`/leave/contract-mngmt/contract-sign/${data._id}`]);
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // setAutoComplete() {
    //     // auto complete
    //     this.filteredOptions = this.myControl.valueChanges
    //         .pipe(
    //             startWith(''),
    //             map(value => typeof value === 'string' ? value : value.email),
    //             map((email: any) => email ? this._filter(email) : this.options.slice())
    //         );

    //     console.log(this.filteredOptions);
    // }

    // //auto
    // // displayFn(employee: Employees): string {
    // //   return employee && employee.email ? employee.email : '';
    // // }
    // // getOptionText(employee: Employees) {
    // //   return employee.email ? employee.email : '';
    // // }
    // private _filter(email: string): Employees[] {
    //     const filterValue = email.toLowerCase();
    //     return this.options.filter(option => option.email.toLowerCase().includes(filterValue));
    // }

    // myEmployeeLeaveListSearch() {
    //     let myEmployeeInfo;
    //     const formValue = this.employeeForm.value;

    //     console.log(this.myControl.value);

    //     myEmployeeInfo = {
    //         type: formValue.type,
    //         leave_start_date: this.commonService.dateFormatting(formValue.leave_start_date),
    //         leave_end_date: this.commonService.dateFormatting(formValue.leave_end_date),

    //         // leave_start_date: formValue.leave_start_date,
    //         // leave_end_date: formValue.leave_end_date,
    //         emailFind: this.myControl.value,
    //     }

    //     // 조건에 따른 사원들 휴가 가져오기
    //     this.employeeMngmtService.getEmployeeLeaveListSearch(myEmployeeInfo).subscribe(
    //         (data: any) => {
    //             console.log(data)
    //             data.myEmployeeLeaveListSearch = data.myEmployeeLeaveListSearch.map((item) => {
    //                 item.startDate = this.commonService.dateFormatting(item.startDate, 'timeZone');
    //                 item.endDate = this.commonService.dateFormatting(item.endDate, 'timeZone');
    //                 return item;
    //             });
    //             this.dataSource = new MatTableDataSource<PeriodicElement>(data.myEmployeeLeaveListSearch);
    //             this.dataSource.paginator = this.paginator;
    //             this.options = data.myEmployeeList;
    //             this.setAutoComplete();
    //             console.log(this.dataSource.filteredData)
    //         }
    //     )
    // }

    // openDialogPendingLeaveDetail(data) {

    //     const dialogRef = this.dialog.open(LeaveRequestDetailsComponent, {
    //         // width: '600px',
    //         // height: '614px',

    //         data: {
    //             requestor: data._id,
    //             requestorName: data.name,
    //             leaveType: data.leaveType,
    //             leaveDuration: data.duration,
    //             leave_end_date: data.endDate,
    //             leave_start_date: data.startDate,
    //             leave_reason: data.leave_reason,
    //             status: data.status,
    //             createdAt: data.createdAt,
    //             approver: data.approver,
    //             rejectReason: data.rejectReason
    //         }

    //     });

    //     dialogRef.afterClosed().subscribe(result => {
    //         console.log('dialog close');
    //     })
    // }

    // exportData() {
    //     this.excelSrv.exportToData(this.dataSource.filteredData);
    // }
}

