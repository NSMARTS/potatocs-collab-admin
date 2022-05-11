import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { CanvasService } from 'src/@dw/services/contract-mngmt/canvas/canvas.service';
import { CANVAS_CONFIG } from 'src/@dw/services/contract-mngmt/config/config';
import { ContractMngmtService } from 'src/@dw/services/contract-mngmt/contract/contract-mngmt.service';
import { EventBusService } from 'src/@dw/services/contract-mngmt/eventBus/event-bus.service';
import { RenderingService } from 'src/@dw/services/contract-mngmt/rendering/rendering.service';
import { DrawStorageService } from 'src/@dw/services/contract-mngmt/storage/draw-storage.service';
import { EditInfoService } from 'src/@dw/services/contract-mngmt/store/edit-info.service';
import { ViewInfoService } from 'src/@dw/services/contract-mngmt/store/view-info.service';

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
    @ViewChild('canvasCover', { static: true }) public coverCanvasRef: ElementRef;
    @ViewChild('teacherCanvas', { static: true }) public teacherCanvasRef: ElementRef;


    canvasContainer: HTMLDivElement;
    canvasCover: HTMLCanvasElement;
    teacherCanvas: HTMLCanvasElement;

    rendererEvent1: any;

    drawEvent:any;

    constructor(
        public dialogRef: MatDialogRef<ContractDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,

        private editInfoService: EditInfoService,
        private viewInfoService: ViewInfoService,
        private canvasService: CanvasService,
        private renderingService: RenderingService,
        private eventBusService: EventBusService,
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

        console.log(this.data)
         
        this.setCanvasSize();

        // DB로부터 sign 좌표가 있으면 drawing 부분
        if(this.data.senderSign){
            for (let i = 0; i < this.data.senderSign[0].drawingEvent.length; i++) {
                this.drawStorageService.setDrawEvent(1, this.data.senderSign[0].drawingEvent[i])
            }
            this.pageRender(1, 1)
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
        this.canvasCover = this.coverCanvasRef.nativeElement;
        this.teacherCanvas = this.teacherCanvasRef.nativeElement;
        this.canvasContainer = this.canvasContainerRef.nativeElement;

        // Canvas Container Size 조절
        this.canvasContainer.style.width = 400 + 'px';
        this.canvasContainer.style.height = 160 + 'px';

        this.canvasCover.width = 400
        this.canvasCover.height = 160

        // Cover Canvas 조절
        this.teacherCanvas.width = this.canvasCover.width
        this.teacherCanvas.height = this.canvasCover.height
    }



    /**
     * 판서 Rendering
     *
     * @param currentPage
     * @param zoomScale
     */
    async pageRender(currentPage, zoomScale) {
        console.log('>>> page Board Render!');

        // board rendering
        const drawingEvents = this.drawStorageService.getDrawingEvents(currentPage);
        this.renderingService.renderBoard(this.teacherCanvas, zoomScale, drawingEvents);
    }

}
