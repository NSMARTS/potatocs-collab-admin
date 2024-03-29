import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-leave-request-details',
	templateUrl: './leave-request-details.component.html',
	styleUrls: ['./leave-request-details.component.scss']
})
export class LeaveRequestDetailsComponent implements OnInit {

	viewType = {
		'annual_leave': 'Annual Leave',
		'rollover': 'Rollover',
		'sick_leave': 'Sick Leave',
		'replacementday_leave': 'Replacement Day'
	}

	constructor(
		public dialogRef: MatDialogRef<LeaveRequestDetailsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
	) { }

	ngOnInit(): void {
		
	}

}
