import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ContractMngmtService } from 'src/@dw/services/contract-mngmt/contract/contract-mngmt.service';
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


    contractId;


    private unsubscribe$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private viewInfoService: ViewInfoService,
        private pdfStorageService: PdfStorageService,
        private fileService: FileService,
        private zoomService: ZoomService,
        private contractMngmtService: ContractMngmtService,
    ) { }

    ngOnInit(): void {
        this.contractId = this.route.snapshot.params['id'];

        this.updateDocuments();        
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
        
        console.log(numPages)

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



    /**
   *
  * 서버에서 meeting id에 따른 document data 수신
  * - 수신 후 필요한 document data download
  * - pdf와 draw event local에 저장
  *
  */
    async updateDocuments() {
        
        
        console.log('>> do Update Contract');

        const data = {
            _id: this.contractId
        }

        console.log('111111111111111111111111111111')
        // contract_id에 해당하는 contract 정보 수신
        const result: any = await this.contractMngmtService.getContractInfo(data).toPromise();

        console.log(result)
        console.log('22222222222222222222222222222222')

        console.log('[API] <----- RX Contract Info : ', result);

        // 문서가 없으면 동작 안함
        if (!result.contractResult || result.contractResult.length == 0) {
            console.log('no Documents');
            return null;
        }

        // 1. get PDF File & Generate Pdf File Buffer
        const contractResult = await this.generatePdfData(result);

        console.log(contractResult)

        // 2. PDF DRAW Storage Update
        await this.updatePdfAndDrawStorage(contractResult);

        // 3. view status update
        this.updateViewInfoStore();
    }



    /**
   * 각 PDF document api 요청 / 수신
   * @param result
   * @returns
   */

    async generatePdfData(result) {

        const pdfArrayVar = this.pdfStorageService.pdfVar;

        // console.log(pdfArrayVar)

        // this._docIdList.push(result.contractResult[i]._id);
        const updatedTime = result.contractResult.updatedAt;

        ////////////////////////////////////////////////////////////////////////
        // PDF File Buffer update
        // pdf가 load된 시간을 비교하여 변경된 경우에만 file 요청)
        // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Optional_chaining
        if (pdfArrayVar?.updatedAt !== updatedTime) {
            try {

                const data = {
                    _id: result.contractResult._id
                }


                // PDF File 정보 요청
                const res = await this.contractMngmtService.getPdfFile(data).toPromise()

                // Array buffer로 변환
                const file = await this.fileService.readFile(res);
                result.contractResult.fileBuffer = file;

            } catch (err) {
                console.log(err);
                return err;
            }
        }

        // 이미 있는 filebuffer에 대해서는 기존 array buffer값을 복사
        else {
            result.contractResult.fileBuffer = pdfArrayVar.fileBuffer;
        }
        ////////////////////////////////////////////////////////////////////////

        return result.contractResult;
    }


    /**
   * 수신된 PDF Document 와 Draw Data 저장
   * - pdf 변환
   */
    async updatePdfAndDrawStorage(contractData) {

        console.log(">> do:update Pdf And Draw Storage");

        /*---------------------------------------
          pdf 관련 변수 초기화 : 기존의 pdf clear 및 destroy 수행
        -----------------------------------------*/
        this.pdfStorageService.memoryRelease();

        // 현재 저장된 PDF Array 변수
        let pdfVarArray = this.pdfStorageService.pdfVar;

        console.log(pdfVarArray)
        console.log(contractData)

        // // 문서 개수의 차이
        // const diff = contractData.length - pdfVarArray.length;
        // console.log('diff : ', diff)
        // // document length가 더 긴경우 : 배열 추가
        // if (diff > 0) {
        //     for (let i = 0; i < diff; i++) {
        //         pdfVarArray.push({});
        //     }
        // }

        // // document length가 더 짧은 경우 (현재는 없음 -> 추후 문서 삭제 등)
        // // splice (a, b) a 번째 자리 수에 b 갯수 만큼 삭제
        // // splice (a, b, 'c') a 번째 자리 수에 b 갯수 만큼 삭제 후 c 추가
        // else if (diff < 0) {
        //     pdfVarArray.splice(0, (diff * -1));
        // }

        //1. Document 별 판서 Event 저장
        // this.drawStorageService.setDrawEventSet(i + 1, documentData[i].drawingEventSet);
        // console.log(this.drawStorageService.drawVarArray)
        // 2. PDF 관련값 저장 및 PDF 변환
        pdfVarArray._id = contractData._id;
        pdfVarArray.fileBuffer = contractData.fileBuffer;
        pdfVarArray.updatedAt = contractData.updatedAt;
        pdfVarArray.fileName = contractData.originalFileName;

        console.log(contractData)


        // PDF 변환 및 추가 저장
        const result = await this.fileService.pdfConvert(pdfVarArray.fileBuffer);

        pdfVarArray.pdfDestroy = result.pdfDoc;
        pdfVarArray.pdfPages = result.pdfPages;

        //  PDF Docouments storage에 저장
        this.pdfStorageService.setPdfVar(pdfVarArray);
        // console.log(this.drawStorageService.drawVarArray)

        return;
    }



    /**
   *
   * ViewInfo Store update
   * -> document Info 부분 udpate
   *    - document _id, currentPage, numPages, fileName
   *
   * -> currentDocId, current DocNum, currentPage field 초기화
   *
   */

    updateViewInfoStore() {
        let contractInfo = [...this.viewInfoService.state.contractInfo];
        console.log(contractInfo)
        console.log(this.pdfStorageService.pdfVar)
        // console.log(this.viewInfoService.state.pageInfo.currentDocId)
        // const diff = this.pdfStorageService.pdfVar.length - contractInfo.length
        // if (diff > 0) {
        //     for (let item of this.pdfStorageService.pdfVar) {
        //         // 기존에 없던 문서인 경우 추가
        //         const isExist = contractInfo.some((doc) => doc._id === item._id)
        //         if (!isExist) {
        //             contractInfo.push({
        //                 _id: item._id,
        //                 currentPage: 1,
        //                 numPages: item.pdfPages.length,
        //                 fileName: item.fileName
        //             });
        //         }
        //     };

        // } else if (diff < 0) {
            // contractInfo = contractInfo.filter((item) => this.pdfStorageService.pdfVar.some((element) => element._id == item._id))
        // }
        // const obj: any = {
        //     contractInfo: contractInfo
        // }


        // // 최초 load인 경우 document ID는 처음 것으로 설정
        // if (!this.viewInfoService.state.pageInfo.currentDocId) {
        //     obj.pageInfo = {
        //         currentDocId: contractInfo[0]._id,
        //         currentDocNum: 1,
        //         currentPage: 1,
        //         zoomScale: this.zoomService.setInitZoomScale()
        //     }
        // }


        // // viewInfoService 현재 바라보는 문서가 있을경우 함수 실행
        // if (this.viewInfoService.state.pageInfo.currentDocId) {
        //     // 문서 삭제 시 현재 바라보는 문서와 같은 곳일 경우 팝업 창과 함께 첫 화이트보드로 돌아온다.
        //     // 현재 바라보는 문서 ID와 DB에서 받아온 문서 ID가 일치하는게 없으면 첫 페이지로 돌아오고 문서가 삭제됐다고 알림
        //     const res = this.pdfStorageService.pdfVar.filter((x) => x._id == this.viewInfoService.state.pageInfo.currentDocId);
        //     console.log(res)
        //     if (res.length == 0) {
        //         obj.pageInfo = {
        //             currentDocId: contractInfo[0]._id,
        //             currentDocNum: 1,
        //             currentPage: 1,
        //             zoomScale: this.zoomService.setInitZoomScale()
        //         }
        //         obj.leftSideView = 'fileList';
        //         alert('The pdf file has been deleted');
        //     }
        // }

        const obj = {
            isDocLoaded: true,
            loadedDate: new Date().getTime(),
            numPages: this.pdfStorageService.pdfVar.pdfPages.length,
            currentPage: 1,
            zoomScale: this.zoomService.setInitZoomScale()
        };

        this.viewInfoService.setViewInfo(obj);
    }
    ///////////////////////////////////////////////////////////

}

