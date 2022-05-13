import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DocumentMngmtService {

    constructor(
        private http: HttpClient,
    ) { }


    // get upload document list 
    getUploadDocumentList (data) {
        return this.http.get('/api/v1/admin/document/getUploadDocumentList', {params: data});
    }


    // upload document 
    uploadDocument (data) {
        return this.http.post('/api/v1/admin/document/uploadDocument', data);
    }

    // download document
    downloadDocument(data) {
        return this.http.get('/api/v1/admin/document/downloadDocument', {params: data, responseType: 'blob'} );
    }
    
}
