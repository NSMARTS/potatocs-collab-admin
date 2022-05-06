import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CanvasService } from 'src/@dw/services/contract-mngmt/canvas/canvas.service';
import { CANVAS_CONFIG } from 'src/@dw/services/contract-mngmt/config/config';
import { EventBusService } from 'src/@dw/services/contract-mngmt/eventBus/event-bus.service';
import { RenderingService } from 'src/@dw/services/contract-mngmt/rendering/rendering.service';
import { DrawStorageService } from 'src/@dw/services/contract-mngmt/storage/draw-storage.service';
import { EditInfoService } from 'src/@dw/services/contract-mngmt/store/edit-info.service';
import { ViewInfoService } from 'src/@dw/services/contract-mngmt/store/view-info.service';

@Component({
    selector: 'app-contract-sign',
    templateUrl: './contract-sign.component.html',
    styleUrls: ['./contract-sign.component.scss']
})
export class ContractSignComponent implements OnInit, OnDestroy {

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


    constructor(
        public dialogRef: MatDialogRef<ContractSignComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,

        private editInfoService: EditInfoService,
        private viewInfoService: ViewInfoService,
        private canvasService: CanvasService,
        private renderingService: RenderingService,
        private eventBusService: EventBusService,
        private renderer: Renderer2,
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

        // canvas Element 할당
        this.canvasCover = this.coverCanvasRef.nativeElement;
        this.teacherCanvas = this.teacherCanvasRef.nativeElement;
        this.canvasContainer = this.canvasContainerRef.nativeElement;



        // Tool update(nav Menu)에 따른 event handler 변경
        this.editInfoService.state$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((editInfo) => {
                console.log('[Editor Setting]: ', editInfo);

                this.editDisabled = editInfo.toolDisabled || editInfo.editDisabled;

                // drag Enable
                this.dragOn = false;
                if (editInfo.mode == 'move') this.dragOn = true;

                const currentTool = editInfo.tool;
                this.currentToolInfo = {
                    type: editInfo.tool, // pen, eraser
                    color: editInfo.toolsConfig[currentTool].color,
                    width: editInfo.toolsConfig[currentTool].width
                };
                console.log(this.currentToolInfo)

                const zoomScale = this.viewInfoService.state.zoomScale;

                // canvas Event Handler 설정
                this.canvasService.addEventHandler(this.canvasCover, this.teacherCanvas, this.currentToolInfo, zoomScale);
            });


        this.eventBusListeners();
    }


    // end of ngOnInit
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

        // render listener 해제
        this.rendererEvent1();
    }
    

    eventBusListeners() {
        // board-nav로 부터 현재 페이지 드로잉 이벤트 삭제 
        // 다시 페이지 렌더링
        this.eventBusService.on('rmoveDrawEventPageRendering', this.unsubscribe$, (data) => {
            const viewInfo = this.viewInfoService.state;
            //document Number -> 1부터 시작.
            const pageNum = viewInfo.currentPage;
            const zoomScale = viewInfo.zoomScale;
            this.pageRender(pageNum, zoomScale)
        })
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
