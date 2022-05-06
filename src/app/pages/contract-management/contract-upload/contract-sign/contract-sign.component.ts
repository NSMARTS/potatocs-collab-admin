import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-contract-sign',
    templateUrl: './contract-sign.component.html',
    styleUrls: ['./contract-sign.component.scss']
})
export class ContractSignComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ContractSignComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        console.log(this.data)
    }

}
