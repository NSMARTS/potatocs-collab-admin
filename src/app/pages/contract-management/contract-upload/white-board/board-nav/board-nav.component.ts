import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { ContractSaveComponent } from '../../contract-save/contract-save.component';
import * as moment from 'moment';
import { ViewInfoService } from 'src/@dw/services/contract-mngmt/store/view-info.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PdfStorageService } from 'src/@dw/services/contract-mngmt/storage/pdf-storage.service';
import { DataService } from 'src/@dw/store/data.service';



@Component({
  selector: 'app-board-nav',
  templateUrl: './board-nav.component.html',
  styleUrls: ['./board-nav.component.scss']
})
export class BoardNavComponent implements OnInit {


    pdfData;
    userInfo;


    private unsubscribe$ = new Subject<void>();
    contractForm: FormGroup;
    
    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        public dialog: MatDialog,
        private dialogService: DialogService,
        private viewInfoService: ViewInfoService,
        public dataService: DataService,

    ) { 
        this.contractForm = this.formBuilder.group({
            title: ['', Validators.required]
        });
    }




    ngOnInit(): void {
     
        ////////////////////////////////////////////////
        // Document가 Update 된 경우 (zoom, page change 등)
        this.viewInfoService.state$
            .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
            .subscribe((viewInfo) => {

            
            });

        /////////////////////////////////////////////////////////////


        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            async (data: any) => {
                this.userInfo = data;   
            },
            (err: any) => {
                console.log(err);
            }
        )

    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    // back page
    contractLists() {
        this.router.navigate(['/leave/contract-mngmt/contract-list']);
    }


    // modal Contract
    openSaveContract() {
        
        const formValue = this.contractForm.value.title;
        const convertDate = moment().format("YYYY-MM-DD")

        if(formValue == '') {
            this.dialogService.openDialogNegative('The title does not exist. Try again.');
        } else if(this.pdfData == '') {
            this.dialogService.openDialogNegative('The file does not exist. Try again.');
        } else {            
            const dialogRef = this.dialog.open(ContractSaveComponent, {
                data: {
                    title: formValue,
                    contract_day: convertDate,
                    sender: this.userInfo.name,
                    pdfDAta : this.pdfData
                }
            });
    
            dialogRef.afterClosed().subscribe((data) => {
            
                // this.getUploadDocumentList(this.userInfo.company_id._id);            
            })
        }
        

        
    }

    

}
