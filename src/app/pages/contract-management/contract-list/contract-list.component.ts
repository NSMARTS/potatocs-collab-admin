import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
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

    contractForm: FormGroup


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

                console.log(this.userInfo)

                if (this.userInfo.company_id != undefined) {
                    await new Promise(res => setTimeout(res, 300));
                    this.getContractList();
                }
            },
            (err: any) => {
                console.log(err);
            }
        )

        const startOfMonth = moment().startOf('month').format();
        const endOfMonth = moment().endOf('month').format();

        this.contractForm = this.fb.group({
            status: ['all', [
                Validators.required,
            ]],
            leave_start_date: [startOfMonth, [
                Validators.required,
            ]],
            leave_end_date: [endOfMonth, [
                Validators.required,
            ]],
            receiver: ['', [
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

        console.log(this.userInfo)

        const data = {
            company_id: this.userInfo.company_id._id
        }

        this.contractMngmtService.getContractList(data).subscribe((data: any) => {

            ///////////////////// 검색 필터 ////////////////////
            // 검색 필터 위해서 receiver 중복 값 제외 후 return
            const userFilter = data.contractList.filter((item, i) => {
                return (
                    data.contractList.findIndex((item2, j) => {
                      return item.receiver._id === item2.receiver._id;
                    }) === i
                );
            })

            // console.log(userFilter)
            ////////////////////////////////////////////////////
            console.log(data.contractList)
            if (data.message == 'Success find document list') {
                this.contractList = data.documentList
            }

            this.contractList = new MatTableDataSource<PeriodicElement>(data.contractList);
            this.contractList.paginator = this.paginator;
            this.options = userFilter
            this.setAutoComplete();
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
    setAutoComplete() {
        // auto complete
        console.log(this.myControl.valueChanges)
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.receiver.email),
                map((email: any) => email ? this._filter(email) : this.options.slice())
            );

        // console.log(this.filteredOptions);
    }

    //auto
    // displayFn(employee: Employees): string {
    //   return employee && employee.email ? employee.email : '';
    // }
    // getOptionText(employee: Employees) {
    //   return employee.email ? employee.email : '';
    // }
    private _filter(email: string): Employees[] {
        console.log(email)
        console.log(this.options)
        const filterValue = email.toLowerCase();
        return this.options.filter(option=> {
            console.log(option)
            option.email.toLowerCase().includes(filterValue)
        });
    }

    getMyContractListSearch() {
    //     let myEmployeeInfo;
    //     const formValue = this.contractForm.value;

    //     console.log(formValue);
    //     console.log(this.myControl.value)

    //     myEmployeeInfo = {
    //         status: formValue.status,
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
    }

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

}

