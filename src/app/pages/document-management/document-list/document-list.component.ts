import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { DataService } from 'src/@dw/store/data.service';
import { DocumentUploadComponent } from '../document-upload/document-upload.component';

// view table
export interface PeriodicElement {
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
	displayedColumns: string[] = ['title', 'content', 'document','date'];

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
			(data: any) => {
				this.userInfo = data;
			},
			(err: any) => {
				console.log(err);
			}
		)

		this.getDocumentList();

	}

	openUploadDocument() {
		const dialogRef = this.dialog.open(DocumentUploadComponent,{
			data: {
				documentList: this.documentList
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			this.getDocumentList();
		})
	}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	getDocumentList() {
		// this.holidayMngmtService.getDocumentList().subscribe(
        //     (data: any) => {
		// 		console.log(data)
        //         if(data.message == 'Success find company holiday'){
		// 			this.documentList = data.findCompanyHoliday.company_holiday
		// 			console.log(this.documentList)
		// 		} 
		// 		this.documentList =new MatTableDataSource<PeriodicElement>(data.findCompanyHoliday.company_holiday);
		// 		console.log(this.documentList)
		// 		this.documentList.paginator = this.paginator;
		// 		console.log(this.documentList.paginator)
        //     },
        //     (err: any) => {
        //         console.log(err);
        //     }
        // )
	}


}


