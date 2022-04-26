import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FileService } from 'src/@dw/services/contract-mngmt/file/file.service';
import { PdfStorageService } from 'src/@dw/services/contract-mngmt/storage/pdf-storage.service';
import { ViewInfoService } from 'src/@dw/services/contract-mngmt/store/view-info.service';
import { ZoomService } from 'src/@dw/services/contract-mngmt/zoom/zoom.service';



@Component({
    selector: 'app-contract-upload',
    templateUrl: './contract-upload.component.html',
    styleUrls: ['./contract-upload.component.scss']
})
export class ContractUploadComponent implements OnInit {


    private unsubscribe$ = new Subject<void>();
    private meetingId;

    constructor(
        private viewInfoService: ViewInfoService,
        private pdfStorageService: PdfStorageService,
        private fileService: FileService,
        private zoomService: ZoomService) {

    }

    ngOnInit(): void {



    }
    ///////////////////////////////////////////////////////////

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

    }

    /**
     * Open Local PDF File
     *  - Board File View Component의 @output
     *  - File upload
     *
     * @param newDocumentFile
     */
    async onDocumentOpened(newDocumentFile) {

        this.pdfStorageService.memoryRelease();

        const numPages = await this.fileService.openDoc(newDocumentFile);

        // console.log(this.pdfStorageService.pdfVar);
        const obj = {
            isDocLoaded: true,
            loadedDate: new Date().getTime(),
            numPages: numPages,
            currentPage: 1,
            zoomScale: this.zoomService.setInitZoomScale()
        };

        this.viewInfoService.setViewInfo(obj);
    }
    

}
