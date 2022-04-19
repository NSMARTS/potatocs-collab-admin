import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentMngmtService } from 'src/@dw/services/document-mngmt/document-mngmt.service';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-document-details',
    templateUrl: './document-details.component.html',
    styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<DocumentDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private documentMngmtService: DocumentMngmtService
    ) { }

    ngOnInit(): void { }


    // https://stackoverflow.com/questions/50039015/how-to-download-a-pdf-file-from-an-url-in-angular-5
    downloadDocument(element) {

        console.log(element)


        const data = {
            _id: element._id,
        }

        this.documentMngmtService.downloadDocument(data).subscribe(res => {
            const blob = res;
            saveAs(blob, this.data.originalFileName);
        });


        // console.log(fileData)
        //this.dialogService.openDialogPositive('succeed file download!');
    }

}
