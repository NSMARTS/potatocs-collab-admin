import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { DocumentMngmtService } from 'src/@dw/services/document-mngmt/document-mngmt.service';
import { DataService } from 'src/@dw/store/data.service';
import { DocumentDetailsComponent } from '../document-details/document-details.component';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';

// view table
export interface PeriodicElement {
    number: string;
    title: string;
    content: string;
    document: string;
    date: string;
}

@Component({
    selector: 'app-document-list',
    templateUrl: './document-list.component.html',
    styleUrls: ['./document-list.component.scss']
})

export class DocumentListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    // view table
    displayedColumns: string[] = ['number', 'title', 'content', 'document', 'date'];

    // replacement day requests

    documentList = new MatTableDataSource;
    company;
    manager;
    userInfo;
    // dataSource = ELEMENT_DATA;
    private unsubscribe$ = new Subject<void>();

    constructor(
        public dataService: DataService,
        public dialog: MatDialog,
        private dialogService: DialogService,
        private route: ActivatedRoute,
        private documentMngmtService: DocumentMngmtService
    ) {
    }

    ngOnInit(): void {

        this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.company = data;
            },
            (err: any) => {
                console.log(err);
            },
        );

        this.dataService.userManagerProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.manager = data;
            },
            (err: any) => {
                console.log(err);
            },
        );

        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            async (data: any) => {
                this.userInfo = data;   

                if(this.userInfo.company_id != undefined) {
                    this.getUploadDocumentList(this.userInfo.company_id._id);
                }
                
            },
            (err: any) => {
                console.log(err);
            }
        )
    }
   

    openUploadDocument() {
        const dialogRef = this.dialog.open(DocumentUploadComponent, {
            data: {
                documentList: this.documentList
            }
        });

        dialogRef.afterClosed().subscribe((data) => {
        
            this.getUploadDocumentList(this.userInfo.company_id._id);            
        })
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    // 업로드 된 문서 가져오기
    getUploadDocumentList(company_id) {
        console.log(this.userInfo.company_id)

        const data = {
            company_id: company_id
        }
        
        this.documentMngmtService.getUploadDocumentList(data).subscribe(
            (data: any) => {
                if(data.message == 'Success find document list'){
        			this.documentList = data.documentList
        		} 
        		this.documentList =new MatTableDataSource<PeriodicElement>(data.documentList);
        		this.documentList.paginator = this.paginator;
            },
            (err: any) => {
                console.log(err);
            }
        )
    }


    documentDetails(data) {
        const dialogRef = this.dialog.open(DocumentDetailsComponent, {
            data: {
                _id: data._id,
                uploader: data.uploader,
                title: data.title,
                content: data.content,
                originalFileName: data.originalFileName,
                fileName: data.fileName,
                saveKey: data.saveKey,
                fileSize: data.fileSize
            }
        });
    }
    


}


