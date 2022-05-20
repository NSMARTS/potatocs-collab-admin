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
import { ContractSignComponent } from '../../contract-sign/contract-sign.component';
import { ContractMngmtService } from 'src/@dw/services/contract-mngmt/contract/contract-mngmt.service';
import { DrawStorageService } from 'src/@dw/services/contract-mngmt/storage/draw-storage.service';
import { ContractDetailsComponent } from '../../contract-details/contract-details.component';



@Component({
  selector: 'app-board-nav',
  templateUrl: './board-nav.component.html',
  styleUrls: ['./board-nav.component.scss']
})
export class BoardNavComponent implements OnInit {


    pdfData;
    userInfo;
    contractId;
    contractInfo;

    flag: boolean;


    private unsubscribe$ = new Subject<void>();
    contractForm: FormGroup;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private dialogService: DialogService,
        public dataService: DataService,
        private eventBusService: EventBusService,
        private contractMngmtService: ContractMngmtService,
        private drawStorageService: DrawStorageService,
    ) { }




    ngOnInit(): void {

        this.flag = false;

        this.contractId = this.route.snapshot.params['id'];

        const data = {
            _id: this.contractId
        }

        if(this.contractId) {
            // contract_id에 해당하는 contract 정보 수신
            this.contractMngmtService.getContractInfo(data).subscribe((result) => {
                this.contractInfo = result;

                console.log(this.contractInfo)

                console.log(this.contractInfo.contractResult.senderSign[0])
                this.flag = true;
            })
        }
        
        
        
        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            async (data: any) => {
                this.userInfo = data;   
                console.log(this.userInfo)
                
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
                    pdfData : this.pdfData,
                    channel : this.userInfo.company_id.channel[0].channel_name
                }
            });
    
            dialogRef.afterClosed().subscribe((data) => {
            
            })
        }
    }

    // modal Contract Sign
    async openSignContract() {

        const data = {
            _id: this.contractId
        }

        // contract_id에 해당하는 contract 정보 수신
        const result: any = await this.contractMngmtService.getContractInfo(data).toPromise();

        const dialogRef = this.dialog.open(ContractSignComponent, {
            maxHeight: '100vh',
            data: result.contractResult
        });

        dialogRef.afterClosed().subscribe(result => {
            // modal이 닫히면 그렸던 draw 정보 초기화 시켜주기
			this.drawStorageService.resetDrawingEvents()
		})

    }


    async openContractDetail() {
        const data = {
            _id: this.contractId
        }

        // contract_id에 해당하는 contract 정보 수신
        const result: any = await this.contractMngmtService.getContractInfo(data).toPromise();

        const dialogRef = this.dialog.open(ContractDetailsComponent, {
            maxHeight: '100vh',
            data: result.contractResult
        });


        dialogRef.afterClosed().subscribe(result => {
            // modal이 닫히면 그렸던 draw 정보 초기화 시켜주기
			this.drawStorageService.resetDrawingEvents()
		})
    }
}
