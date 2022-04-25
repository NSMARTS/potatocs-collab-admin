import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Employees } from '../../contract-list/contract-list.component';

@Component({
    selector: 'app-contract-save',
    templateUrl: './contract-save.component.html',
    styleUrls: ['./contract-save.component.scss']
})
export class ContractSaveComponent implements OnInit {

    saveContractForm: FormGroup;

    myControl = new FormControl();
    filteredOptions: Observable<Employees[]>;
    options: Employees[];

    contractData;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,


    ) {
        this.saveContractForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            contract_day: ['', [Validators.required]],
            sender: ['', [Validators.required]],
            receiver: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        console.log(this.data)
        this.contractData = this.data
    }


    setAutoComplete() {
        // auto complete
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.email),
                map((email: any) => email ? this._filter(email) : this.options.slice())
            );

        console.log(this.filteredOptions);
    }

    //auto
    displayFn(employee: Employees): string {
      return employee && employee.email ? employee.email : '';
    }
    getOptionText(employee: Employees) {
      return employee.email ? employee.email : '';
    }
    private _filter(email: string): Employees[] {
        const filterValue = email.toLowerCase();
        return this.options.filter(option => option.email.toLowerCase().includes(filterValue));
    }

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
}
