import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { ContractMngmtService } from 'src/@dw/services/contract-mngmt/contract/contract-mngmt.service';
import { Employees, PeriodicElement } from '../../contract-list/contract-list.component';

@Component({
    selector: 'app-contract-save',
    templateUrl: './contract-save.component.html',
    styleUrls: ['./contract-save.component.scss']
})
export class ContractSaveComponent implements OnInit {

    displayedColumns: string[] = ['name', 'email', 'invite'];

    saveContractForm: FormGroup;
    contractorForm: FormGroup;

    // myControl = new FormControl();
    filteredOptions: Observable<Employees[]>;
    options: Employees[];

    contractData;

    receiverSearchChecked = false;

    searchEmail;
    displaymemberInfo;
    memberInfo:any;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ContractSaveComponent>,
        private dialogService: DialogService,
        private router: Router,

        private formBuilder: FormBuilder,
        private contractMngmtService: ContractMngmtService,
        private snackbar: MatSnackBar,
        

    ) {
        this.saveContractForm = this.formBuilder.group({
            title: ['', [Validators.required]],
            description: ['', [Validators.required]],
            date: ['', [Validators.required]],
            sender: ['', [Validators.required]],
        });

        this.contractorForm = this.formBuilder.group({
            receiver: ['', [Validators.required]],
		});
    }

    ngOnInit(): void {
        console.log(this.data)
        this.contractData = this.data
    }


    // 계약서 저장
    saveContract() {

        const formData = new FormData();
        formData.append('company_id', this.contractData.company_id);
        formData.append('title', this.saveContractForm.value.title);
        formData.append('description', this.saveContractForm.value.description);
        formData.append('date', this.saveContractForm.value.date)
        formData.append('sender', this.saveContractForm.value.sender);
        formData.append('receiver', this.contractorForm.value.receiver);
        formData.append('file', this.contractData.pdfData);

        //////////////////////////////////////////////////////////////////////////////////////
        /* Receiver를 올바르게 검색 후, 아무렇게 Receiver email를 기입해도 save 되는 문제 처리  */
        if(this.memberInfo.email != this.contractorForm.value.receiver){
            console.log(this.memberInfo)
            this.receiverSearchChecked = false;
            this.contractorForm.reset();
            return this.dialogService.openDialogNegative('Please, check the email.');
        }
        //////////////////////////////////////////////////////////////////////////////////////

        this.dialogService.openDialogConfirm('Do you want save this contract?').subscribe((result: any) => {
			if (result) {

                this.contractMngmtService.saveContract(formData).subscribe( 
					(data: any) => {
						console.log(data);
						if(data.message == 'Success saved contract') {
							// this.getCompanyHolidayList();
                            this.dialogRef.close();
                            this.router.navigate(['/leave/contract-mngmt/contract-list']);
						}
					},
					(err: any) => {
						if (err.error.message == 'Deleting company holiday Error'){
							this.dialogService.openDialogNegative('An error has occurred.');
						}
					}
				);

			}
		});
    }

    searchContractor() {

		const email = this.contractorForm.value.receiver;

        const data = {
            email: email,
            channel: this.contractData.channel
        }

		this.contractMngmtService.searchContractor(data).subscribe(
			(data: any) => {

				if (data.searchContractor == null) {
                    this.contractorForm.reset();
					this.dialogService.openDialogNegative('Please, check the email.');
					// alert(`It's a member that doesn't exist.\nPlease check email`);
				}
				else {
                    this.snackbar.open('Successfully, the email has been found.', 'Done',{
                        duration: 2000,
                        // horizontalPosition: "right",
                        panelClass: ['search-snackbar',],
                        
                    });
                    
					this.displaymemberInfo = [data.searchContractor];
					this.memberInfo = data.searchContractor;

                    this.receiverSearchChecked = true;
				}
			},
			(err: any) => {
				console.log(err);
			}
		)
	}




    // // 자동완성 ///////////////////////////////////////////////////////////////////////////
    // setAutoComplete() {
    //     // auto complete
    //     this.filteredOptions = this.myControl.valueChanges
    //         .pipe(
    //             startWith(''),
    //             map(value => typeof value === 'string' ? value : value.email),
    //             map((email: any) => email ? this._filter(email) : this.options.slice())
    //         );

    //     // console.log(this.filteredOptions);
    // }

    // //auto
    // displayFn(employee: Employees): string {
    //     return employee && employee.email ? employee.email : '';
    // }
    // getOptionText(employee: Employees) {
    //     return employee.email ? employee.email : '';
    // }
    // private _filter(email: string): Employees[] {
    //     const filterValue = email.toLowerCase();
    //     return this.options.filter(option => option.email.toLowerCase().includes(filterValue));
    // }   
    // // 자동완성 ///////////////////////////////////////////////////////////////////////////




    


}
