import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ContractMngmtService } from 'src/@dw/services/contract-mngmt/contract/contract-mngmt.service';
import { Employees, PeriodicElement } from '../../contract-list/contract-list.component';

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

        private contractMngmtService: ContractMngmtService,

    ) {
        this.saveContractForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            date: ['', [Validators.required]],
            sender: ['', [Validators.required]],
            receiver: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        console.log(this.data)
        this.contractData = this.data

        this.myEmployeeList();
    }





    // 직원 목록 가져오기
    myEmployeeList() {
        this.contractMngmtService.getEmployeeList().subscribe(
            (data: any) => {
                // console.log(data)

                this.options = data.myEmployeeList;
                this.setAutoComplete();
            });
    }

    // 계약서 저장
    saveContract() {

        const formData = new FormData();
        formData.append('companyId', this.contractData.companyId);
        formData.append('title', this.saveContractForm.value.title);
        formData.append('description', this.saveContractForm.value.description);
        formData.append('date', this.saveContractForm.value.date)
        formData.append('sender', this.saveContractForm.value.sender);
        formData.append('receiver', this.saveContractForm.value.receiver);
        formData.append('file', this.contractData.pdfData);

        this.contractMngmtService.saveContract(formData).subscribe(()=> {

        })
    }




    // 자동완성 ///////////////////////////////////////////////////////////////////////////
    setAutoComplete() {
        // auto complete
        this.filteredOptions = this.myControl.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.email),
                map((email: any) => email ? this._filter(email) : this.options.slice())
            );

        // console.log(this.filteredOptions);
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
    // 자동완성 ///////////////////////////////////////////////////////////////////////////




    


}
