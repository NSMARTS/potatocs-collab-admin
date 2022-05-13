import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CANVAS_CONFIG } from 'src/@dw/services/contract-mngmt/config/config';
import { RenderingService } from 'src/@dw/services/contract-mngmt/rendering/rendering.service';
import { DrawStorageService } from 'src/@dw/services/contract-mngmt/storage/draw-storage.service';


@Component({
    selector: 'app-contract-details',
    templateUrl: './contract-details.component.html',
    styleUrls: ['./contract-details.component.scss']
})
export class ContractDetailsComponent implements OnInit, OnDestroy {

    private unsubscribe$ = new Subject<void>();
    

    editDisabled = true;
    dragOn = true;

    currentToolInfo = {
        type: '',
        color: '',
        width: '',
    };

    // static: https://stackoverflow.com/questions/56359504/how-should-i-use-the-new-static-option-for-viewchild-in-angular-8
    @ViewChild('canvasContainer', { static: true }) public canvasContainerRef: ElementRef;
    @ViewChild('senderCanvasCover', { static: true }) public senderCoverCanvasRef: ElementRef;
    @ViewChild('senderCanvas', { static: true }) public senderCanvasRef: ElementRef;
    @ViewChild('receiverCanvasCover', { static: true }) public receiverCoverCanvasRef: ElementRef;
    @ViewChild('receiverCanvas', { static: true }) public receiverCanvasRef: ElementRef;


    canvasContainer: HTMLDivElement;
    senderCanvasCover: HTMLCanvasElement;
    senderCanvas: HTMLCanvasElement;
    receiverCanvasCover: HTMLCanvasElement;
    receiverCanvas: HTMLCanvasElement

    rendererEvent1: any;

    drawEvent:any;

    flag: boolean;


    constructor(
        public dialogRef: MatDialogRef<ContractDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,

        private renderingService: RenderingService,
        private drawStorageService: DrawStorageService,
    ) { }

    // Resize Event Listener
    @HostListener('window:resize') resize() {
        const newWidth = window.innerWidth
        const newHeight = window.innerHeight
        // sidenav 열릴때 resize event 발생... 방지용도.
        if (CANVAS_CONFIG.maxContainerWidth === newWidth && CANVAS_CONFIG.maxContainerHeight === newHeight) {
            return;
        }
        CANVAS_CONFIG.maxContainerWidth = newWidth;
        CANVAS_CONFIG.maxContainerHeight = newHeight;
    }

    ngOnInit(): void {

        this.flag = false;

        if(this.data.status == 'Reject'){
            this.flag = true;
        } 
         
        this.setCanvasSize();

        /***************************************
         * DB로부터 sign 좌표가 있으면 drawing 부분
         ***************************************/
        if(this.data.senderSign.length != 0){
            for (let i = 0; i < this.data.senderSign[0].drawingEvent.length; i++) {
                this.drawStorageService.setDrawEvent(1, this.data.senderSign[0].drawingEvent[i])
            }
            this.pageRender1(1, 1)

            /***************************************
             * 내 sign을 그리려면 상대방의 drawStorage에 drawingEvent 정보를 초기화 해줘야 한다.
             ***************************************/
            this.drawStorageService.resetDrawingEvents();
        } 

        

         if(this.data.receiverSign.length != 0){
            for (let i = 0; i < this.data.receiverSign[0].drawingEvent.length; i++) {
                this.drawStorageService.setDrawEvent(1, this.data.receiverSign[0].drawingEvent[i])
            }
            this.pageRender2(1, 1)

            /***************************************
             * 내 sign을 그리려면 상대방의 drawStorage에 drawingEvent 정보를 초기화 해줘야 한다.
            ***************************************/
            this.drawStorageService.resetDrawingEvents();
        } 
    }


    // end of ngOnInit
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    /**
     * Canvas size 설정
     *
     * @param currentPage
     * @param zoomScale
     * @returns
     */
    setCanvasSize() {
  
        // canvas Element 할당
        this.canvasContainer = this.canvasContainerRef.nativeElement;
        this.senderCanvas = this.senderCanvasRef.nativeElement;
        this.senderCanvasCover = this.senderCoverCanvasRef.nativeElement;
        
        this.receiverCanvas = this.receiverCanvasRef.nativeElement;
        this.receiverCanvasCover = this.receiverCoverCanvasRef.nativeElement;

        // Canvas Container Size 조절
        this.canvasContainer.style.width = 400 + 'px';
        this.canvasContainer.style.height = 160 + 'px';

        this.senderCanvasCover.width = 400
        this.senderCanvasCover.height = 160

        // Cover Canvas 조절
        this.senderCanvas.width = this.senderCanvasCover.width
        this.senderCanvas.height = this.senderCanvasCover.height


        this.receiverCanvasCover.width = 400
        this.receiverCanvasCover.height = 160

        this.receiverCanvas.width = this.receiverCanvasCover.width
        this.receiverCanvas.height = this.receiverCanvasCover.height
    }



    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * 판서 Rendering (sender 부분)
     *
     * @param currentPage
     * @param zoomScale
     */
    async pageRender1(currentPage, zoomScale) {
        console.log('>>> page Board Render!');

        // board rendering
        const drawingEvents = this.drawStorageService.getDrawingEvents(currentPage);
        this.renderingService.renderBoard(this.senderCanvas, zoomScale, drawingEvents);
    }

    /**
     * 판서 Rendering (receiver 부분)
     *
     * @param currentPage
     * @param zoomScale
     */
    async pageRender2(currentPage, zoomScale) {
        console.log('>>> page Board Render!');

        // board rendering
        const drawingEvents = this.drawStorageService.getDrawingEvents(currentPage);
        this.renderingService.renderBoard(this.receiverCanvas, zoomScale, drawingEvents);
        //////////////////////////////////////////////////////////////////////////////////////
    }

}
