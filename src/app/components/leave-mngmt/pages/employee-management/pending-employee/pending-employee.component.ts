import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'src/app/services/admin/dialog/dialog.service';
import { EmployeeMngmtService } from 'src/app/services/employee-mngmt/employee-mngmt.service';

@Component({
	selector: 'app-pending-employee',
	templateUrl: './pending-employee.component.html',
	styleUrls: ['./pending-employee.component.scss']
})
export class PendingEmployeeComponent implements OnInit {

	displayedColumns: string[] = ['name', 'email', 'acceptButton', 'cancelButton'];
	getPendingList;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private employeeMngmtService: EmployeeMngmtService,
		private dialogService: DialogService
	) { }

	ngOnInit(): void {
		this.employeeMngmtService.getPending().subscribe(
			(data: any) => {
				console.log('[[pending-employee component]] >>', data);
				if (data.message == 'found') {
					this.getPendingList = data.pendingList
					console.log(this.getPendingList);
				} else {
					this.getPendingList = null;
				}
			},
			err => {
				console.log(err);
				this.dialogService.openDialogNegative(err.error.message);
				// alert(err.error.message);
			}
		);
	}

	acceptRequest(docId, userId) {
		const sendData = {
			docId,
			userId
		}

		this.dialogService.openDialogConfirm(`Do you want to accept this employee's request?`).subscribe(result => {
			if (result) {
				this.employeeMngmtService.acceptRequest(sendData).subscribe(
					(data: any) => {
						if (data.message == 'accepted') {
							this.dialogService.openDialogPositive('successfully accepted the request');
							// alert('successfully accepted the request');
							window.location.reload();
						} else {
							console.log(data.message);
						}
					},
					err => {
						console.log(err);
						this.dialogService.openDialogNegative(err.error.message);
						// alert(err.error.message);
					}
				);
			}
		});
	}

	cancelRequest(docId) {

		this.dialogService.openDialogConfirm(`Do you want to cancel this employee's request?`).subscribe(result => {
			if (result) {
				this.employeeMngmtService.cancelRequest(docId).subscribe(
					(data: any) => {
						if (data.message == 'canceled') {
							this.dialogService.openDialogPositive('successfully canceled the request');
							// alert('successfully canceled the request');
						}
						window.location.reload();
					},
					err => {
						console.log(err);
						this.dialogService.openDialogNegative(err.error.message);
						// alert(err.error.message);
					}
				);
			}
		})
	}
}
