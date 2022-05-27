import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { CommonService } from 'src/@dw/services/common/common.service';
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
        'reject': 'Reject',
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private contractMngmtService: ContractMngmtService,
        public dataService: DataService,
        private commonService: CommonService,
        private snackbar: MatSnackBar,
    ) { }

    ngOnInit(): void {

        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            async (data: any) => {
                this.userInfo = data;
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
            start_date: [startOfMonth, [
                Validators.required,
            ]],
            end_date: [endOfMonth, [
                Validators.required,
            ]]
        });

       
        this.getContractList();
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

        this.contractMngmtService.getContractList().subscribe((data: any) => {

            ///////////////////// 검색 필터 ////////////////////
            // 검색 필터 위해서 receiver 중복 값 제외 후 return
            const userFilter = data.contractList.filter((item, i) => {
                return (
                    data.contractList.findIndex((item2, j) => {
                      return item.receiver._id === item2.receiver._id;
                    }) === i
                );
            })
            ////////////////////////////////////////////////////

            console.log(data.contractList);
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
                map(value => typeof value === 'string' ? value : value.email),
                // map((email: any) => email ? this._filter(email) : this.options.slice()) // 원래 코드
                map((email: any) => email ? this.options.slice() : this.options.slice())
            );
    }

    private _filter(email: string): Employees[] {
        console.log(email)
        const filterValue = email.toLowerCase();
        return this.options.filter(option => option.email.toLowerCase().includes(filterValue));
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////


    // 계약서 검색
    getMyContractListSearch() {
        
        const formValue = this.contractForm.value;
    
        const data = {
            status: formValue.status,
            start_date: this.commonService.dateFormatting(formValue.start_date),
            end_date: this.commonService.dateFormatting(formValue.end_date),
            email: this.myControl.value,
        }


        console.log(data)

        // 조건에 따른 사원들 휴가 가져오기
        this.contractMngmtService.getContractListSearch(data).subscribe(
            (data: any) => {
                console.log(data.contractList)

                if (data.message == 'Success find document list') {
                    this.contractList = data.documentList
                }

                this.contractList = new MatTableDataSource<PeriodicElement>(data.contractList);
                this.contractList.paginator = this.paginator;
            }
        )

        this.snackbar.open('Successfully get leave search data','Close' ,{
            duration: 3000,
            horizontalPosition: "center"
        });
    }

    


    ////////////////////////////////////////////////////////////////////////////////////////////////

}

