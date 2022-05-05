import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { ContractSaveComponent } from '../../contract-save/contract-save.component';
import * as moment from 'moment';
import { ViewInfoService } from 'src/@dw/services/contract-mngmt/store/view-info.service';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PdfStorageService } from 'src/@dw/services/contract-mngmt/storage/pdf-storage.service';
import { DataService } from 'src/@dw/store/data.service';
import { EventBusService } from 'src/@dw/services/contract-mngmt/eventBus/event-bus.service';



@Component({
  selector: 'app-board-nav',
  templateUrl: './board-nav.component.html',
  styleUrls: ['./board-nav.component.scss']
})
export class BoardNavComponent implements OnInit {


    pdfData;
    userInfo;
    contractId;


    private unsubscribe$ = new Subject<void>();
    contractForm: FormGroup;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private dialogService: DialogService,
        private viewInfoService: ViewInfoService,
        public dataService: DataService,
        private eventBusService: EventBusService,
        private pdfStorageService: PdfStorageService,

    ) { }




    ngOnInit(): void {

        this.contractId = this.route.snapshot.params['id'];

        // console.log(this.contractId)


        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            async (data: any) => {
                this.userInfo = data;   
            },
            (err: any) => {
                console.log(err);
            }
        )

        this.eventBusService.on('DocFile', this.unsubscribe$, (data) => {
            this.pdfData = data           
        })

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


    // modal Contract save
    openSaveContract() {
        
        const convertDate = moment().format("YYYY-MM-DD")
        console.log(this.pdfData)
       
        if(this.pdfData == undefined) {
            this.dialogService.openDialogNegative('The contract document does not exist. Try again.');
        } else {            
            const dialogRef = this.dialog.open(ContractSaveComponent, {
                data: {
                    company_id: this.userInfo.company_id._id,
                    date: convertDate,
                    sender: this.userInfo.name,
                    pdfData : this.pdfData
                }
            });
    
            dialogRef.afterClosed().subscribe((data) => {
            
            })
        }
    }

    // modal Contract Sign
    openSignContract() {
        
    }
}
