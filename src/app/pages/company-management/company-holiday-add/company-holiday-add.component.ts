import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { HolidayMngmtService } from 'src/@dw/services/corporation/holiday-mngmt.service';

@Component({
    selector: 'app-company-holiday-add',
    templateUrl: './company-holiday-add.component.html',
    styleUrls: ['./company-holiday-add.component.scss']
})
export class CompanyHolidayAddComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    // view table
    displayedColumns: string[] = ['ch_name', 'ch_date'];
    // form group
    companyHolidayForm: FormGroup;

    // dataSource = ELEMENT_DATA;
    private unsubscribe$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<CompanyHolidayAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogService: DialogService,
        private holidayMngmtService: HolidayMngmtService
    ) { }

    ngOnInit(): void {
        this.companyHolidayForm = this.fb.group({
            holidayName: ['', [Validators.required]],
            holidayDate: ['', [Validators.required]],
        });

    }
    addCompanyHoliday() {
        const formValue = this.companyHolidayForm.value;
        const convertDate = moment(formValue.holidayDate).format("YYYY-MM-DD")
        const companyHolidayData = {
            ch_name: formValue.holidayName,
            ch_date: convertDate,
        }

        // 휴가 중복 체크
        for (let i = 0; i < this.data.companyHolidayList.length; i++) {
            if (this.data.companyHolidayList[i].ch_date == convertDate) {
                this.dialogRef.close();
                return this.dialogService.openDialogNegative('The holiday is duplicated.');
            }
        }

        this.holidayMngmtService.addCompanyHoliday(companyHolidayData).subscribe((data: any) => {
            if (data.message == 'Success add company holiday') {
                this.dialogRef.close();
                this.dialogService.openDialogPositive('Successfully, a holiday has been added.');
            }
        }, (err) => {
            if (err.error.message == 'Duplicate company holiday error.') {
                this.dialogService.openDialogNegative('The holiday is duplicated.');
            } else if (err.error.message == 'Addings company holiday Error') {
                this.dialogService.openDialogNegative('An error has occurred.');
            }
        })
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

    }

    datePickChange(dateValue) {
        this.companyHolidayForm.get('holidayDate').setValue(dateValue);
    }


}
