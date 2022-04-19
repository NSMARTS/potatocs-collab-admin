import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { DocumentMngmtService } from 'src/@dw/services/document-mngmt/document-mngmt.service';


@Component({
    selector: 'app-document-upload',
    templateUrl: './document-upload.component.html',
    styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {

    @ViewChild('uploadInput') uploadInput: ElementRef;

    uploadForm: FormGroup;
    /*******************************************************
    * formControlName 을 사용할 때는 
    * html에 
    * [formGroup]="uploadDocumentForm"
    * formControlName="title" 이런 식으로 사용하나
    * 
    * 현재 파일에 대한 값을 같이 넘겨야하기 때문에 
    * #f="ngForm"    
    * name="title"   이런 식으로 사용한다 
    ********************************************************/
    uploadDocumentForm = new FormGroup({
        title: new FormControl(''),
        content: new FormControl(''),
    });


    public dataSource: any;
    public fileData: File;


    constructor(
        public dialog: MatDialog,
        public dialogRef: MatDialogRef<DocumentUploadComponent>,
        private formBuilder: FormBuilder,
        private documentMngmtService: DocumentMngmtService,
        private dialogService: DialogService
    ) {
        this.uploadForm = this.formBuilder.group({
            title: ['', Validators.required],
            content: ['', Validators.required],
            upload_file: ['', Validators.required]
        });
    }

    ngOnInit(): void { }


    onSubmit(data) {
        // upload document
        this.uploadDocument(data);
    }




    // upload document
    uploadDocument(data) {
        // console.log(data)

        const fileData = this.uploadForm.get('upload_file').value

        if (fileData) {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', data.content);
            formData.append('upload_file', fileData);


            // Add company and store file buffer in blockchain
            this.dialogService.openDialogConfirm(`Unable to delete after upload. Do you want to upload it?`).subscribe((result: any) => {
                if (result) {
                    this.documentMngmtService.uploadDocument(formData).subscribe(async (data: any) => {
                        if (data.message == 'uploaded') {
                            await this.documentMngmtService.getUploadDocumentList().toPromise();
                            this.dialogRef.close();
                        }
                    },
                        (err: any) => {
                            if (err.error.message == 'Uploading document Error') {
                                this.dialogService.openDialogNegative('An error has occurred.');
                            }
                        }
                    )
                }
            });
        } else {
            this.dialogService.openDialogNegative(`Please, upload the '.pdf' file.`);
        }
    }


    // 파일 업로드
    onFileChange(fileData: any) {

        // 파일 유효성 검사
        this.validateDocument(fileData)

        if (fileData.target.files.length > 0) {
            this.fileData = fileData.target.files[0];
            this.uploadForm.get('upload_file').setValue(this.fileData);
        }

    }


    // 파일 유효성 검사
    validateDocument(fileData: any) {

        if (fileData) {
            var ext = (fileData.target.files[0].name).substring((fileData.target.files[0].name).lastIndexOf('.') + 1);

            if (ext.toLowerCase() != 'pdf') {
                this.dialogService.openDialogNegative(`Please, upload the '.pdf' file.`);
                this.uploadInput.nativeElement.value = ''
            }
        }
    }

}
