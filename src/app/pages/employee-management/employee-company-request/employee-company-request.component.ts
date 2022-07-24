import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

// service

import { DialogService } from 'src/@dw/dialog/dialog.service';
import { CompanyRequestStorageService } from 'src/@dw/services/employee-mngmt/company-request-storage.service';
import { ApprovalMngmtService } from 'src/@dw/services/employee-mngmt/approval-mngmt.service';

// view table
export interface pendingRequestData {
	status: string;
	// to: Date;
	email: string;
	name: string;
	createdAt: Date;
}

@Component({
	selector: 'app-employee-company-request',
	templateUrl: './employee-company-request.component.html',
	styleUrls: ['./employee-company-request.component.scss']
})
export class EmployeeCompanyRequestComponent implements OnInit, OnDestroy {

	displayedColumns: string[] = ['email', 'name', 'status', 'createdAt', 'btns'];
	dataSource;
	private destroy$ = new Subject<void>();

	@ViewChild(MatPaginator) paginator: MatPaginator;

	// viewType = {
	// 	'annual_leave': 'Annual Leave',
	// 	'sick_leave': 'Sick Leave',
	// 	'replacementday_leave': 'Replacement Day'
	// }

	constructor(
		private approvalMngmtService: ApprovalMngmtService,
		private router: Router,
		private companyRequestStorageService: CompanyRequestStorageService,
		public dialog: MatDialog,
		public dialogService: DialogService

	) { }

	ngOnInit(): void {
		this.approvalMngmtService.getCompanyRequest().subscribe(
			async (data: any) => {
				// this.dataSource =  new MatTableDataSource<pendingRequestData>(data.pendingRequestData);
				// this.dataSource.paginator = this.paginator;
				await this.getStorageData();
				console.log(this.dataSource);
			}
		);
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	getStorageData() {
		this.companyRequestStorageService.requestData.pipe(takeUntil(this.destroy$)).subscribe(
			(data: any) => {
				this.dataSource = new MatTableDataSource<pendingRequestData>(data);
				this.dataSource.paginator = this.paginator;
			}
		);
	}

	rejectRequest(id, userName) {
		const pendingId = {
			_id: id
		}

		this.dialogService.openDialogConfirm(`Do you want to reject ${userName}'s request?`).subscribe(result => {
			if (result) {
				this.approvalMngmtService.deleteCompanyRequest(pendingId).subscribe(
					(data: any) => {
						console.log(data);
						if (data.message == 'deleted') {
							this.dialogService.openDialogPositive(userName + '\'s request has been rejected.');
						}
					},
					(err: any) => {
						if (err.error.message == '1') {
							console.log('an error while updating');
						} else if (err.error.message == '2') {
							console.log('an error while deleting');
						}
					}
				);
			}
		});
	}

	// 계약일 모달
	createSpaceDialog(id, userName): void {
		console.log(id, userName);
		const spaceDialogRef = this.dialog.open(DialogContractSelectComponent, {
			data: {
				_id: id,
				name: userName
			}
		});

		spaceDialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}
}


///// admin이 accept 누를시 뜨는 모달 -> 여기서 계약일자를 작성
@Component({
	selector: 'dialog-create-folder',
	templateUrl: './dialog-contract-select.component.html',
  styleUrls: ['./employee-company-request.component.scss']
})
export class DialogContractSelectComponent {

	today = new Date();
	date = this.today.getDate()
	month = this.today.getMonth();
	year = this.today.getFullYear();

	setContract = new FormGroup({
		startDate: new FormControl(),
		endDate: new FormControl(),
	})

	constructor(

		private approvalMngmtService: ApprovalMngmtService,
		public dialogRef: MatDialogRef<DialogContractSelectComponent>,
		public dialogService: DialogService,
		@Inject(MAT_DIALOG_DATA) public data: any) {

	}

	onNoClick() {

		this.dialogRef.close();
	}

	// approveRequest
	acceptClick() {
		if (this.setContract.value.startDate == null) {
			// return this.dialogService.openDialogNegative('Start Date must be required!');
			this.dialogService.openDialogConfirm(`If you do not input the employee's contract date, the employee cannot request a leave .`).subscribe(result => {
				if ( !result ) {
					return;
				}
				else if( result ) {	
					this.setContract.value.startDate = '';
					this.acceptEmploy();
				}
			})
		}
		else {
			this.acceptEmploy();
		}
	}
	
	acceptEmploy(){

		if (this.setContract.value.endDate == null) {
			console.log(this.setContract.value.endDate);
			this.setContract.value.endDate = '';
			console.log(this.setContract.value.endDate);
		}
		const sendData = {
			_id: this.data._id,
			name: this.data.name,
			startDate: this.setContract.value.startDate,
			endDate: this.setContract.value.endDate
		}
		console.log(sendData)

		this.dialogService.openDialogConfirm(`Do you want to accept ${sendData.name}'s request?`).subscribe(result => {
			if (result) {
				this.approvalMngmtService.approveCompanyRequest(sendData).subscribe(
					(data: any) => {
						// console.log(data);
						if (data.message == 'approved') {
							this.dialogService.openDialogPositive(sendData.name + '\'s request has been accepted.');
							this.dialogRef.close();
						}
					},
					(err: any) => {
						if (err.error.message == '1') {
							console.log('an error while updating');
						} else if (err.error.message == '2') {
							console.log('an error while deleting');
						} else if (err.error.message == 'BlockChain Network Error') {
							console.log('BlockChain Network Error');
							this.dialogService.openDialogNegative(err.error.message);
						}

					}
				);
			}
		})
	}
}