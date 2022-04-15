import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DocumentMngmtService {

    constructor(
        private http: HttpClient,
    ) { }



    // upload document 
    uploadDocument (data) {
        console.log(data)
        return this.http.post('/api/v1/admin/document/uploadDocument', data);
    }
}
