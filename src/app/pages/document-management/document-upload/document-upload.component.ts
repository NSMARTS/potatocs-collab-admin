import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentMngmtService } from 'src/@dw/services/document-mngmt/document-mngmt.service';


@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {


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
        private formBuilder: FormBuilder,
        private documentMngmtService: DocumentMngmtService
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

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('upload_file', this.uploadForm.get('upload_file').value);

        // Add company and store file buffer in blockchain
        this.documentMngmtService.uploadDocument(formData).subscribe(() => {
        
        })
    }


    // 파일 업로드
    onFileChange(fileData: any) {
        if (fileData.target.files.length > 0) {
            this.fileData = fileData.target.files[0];
              console.log(this.fileData);

            this.uploadForm.get('upload_file').setValue(this.fileData);
        }
    } 

}
