import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import * as moment from 'moment';

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


    constructor(
        public dialogRef: MatDialogRef<ContractSignComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogService: DialogService,
        private router: Router,

        private editInfoService: EditInfoService,
        private viewInfoService: ViewInfoService,
        private canvasService: CanvasService,
        private renderingService: RenderingService,
        private eventBusService: EventBusService,
        private drawStorageService: DrawStorageService,
        private contractMngmtService: ContractMngmtService,
        
        
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
        this.canvasContainer = this.canvasContainerRef.nativeElement;
        this.senderCanvas = this.senderCanvasRef.nativeElement;
        this.senderCanvasCover = this.senderCoverCanvasRef.nativeElement;
        
        this.receiverCanvas = this.receiverCanvasRef.nativeElement;
        this.receiverCanvasCover = this.receiverCoverCanvasRef.nativeElement;



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

                // const zoomScale = this.viewInfoService.state.zoomScale;
                const zoomScale = 1; // sign 부분 canvas에서는 zoomScale 확대와 축소가 필요없기 때문에 1로 고정

                // canvas Event Handler 설정
                this.canvasService.addEventHandler(this.senderCanvasCover, this.senderCanvas, this.currentToolInfo, zoomScale);
        });


        this.eventBusListeners();

        this.setCanvasSize();

        /***************************************
         * DB로부터 sign 좌표가 있으면 drawing 부분
         ***************************************/
         if(this.data.receiverSign.length != 0){
            for (let i = 0; i < this.data.receiverSign[0].drawingEvent.length; i++) {
                this.drawStorageService.setDrawEvent(1, this.data.receiverSign[0].drawingEvent[i])
            }
            this.pageRender(1, 1)
        } 
     
        /***************************************
         * 상대방의 sign 좌표를 받아 서명을 그리기 위해
         * setDrawEvent()를 사용하여 상대방의 좌표를 추가했기 때문에
         * 내가 sign 하려면 drawStorage에 drawingEvent 정보를 초기화 해줘야 한다.
         ***************************************/
        this.drawStorageService.resetDrawingEvents()

        // 서명 local Store 저장
        this.eventBusService.on('gen:newDrawEvent', this.unsubscribe$, async (data) => {
            const pageInfo = this.viewInfoService.state;

            this.drawStorageService.setDrawEvent(pageInfo.currentPage, data);
            
            console.log(this.drawStorageService.drawVar)
            this.drawEvent = this.drawStorageService.drawVar
        });
    }


    // end of ngOnInit
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

        
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
     * Canvas size 설정
     *
     * @param currentPage
     * @param zoomScale
     * @returns
     */
    setCanvasSize() {

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
        this.renderingService.renderBoard(this.receiverCanvas, zoomScale, drawingEvents);
    }



    // 계약서 서명
    signContract() {
        this.dialogService.openDialogConfirm('Do you want save this contract?').subscribe((result: any) => {
			if (result) {
                const convertDate = moment().format("YYYY-MM-DD HH:mm ddd")

                // senderSign key에 value 추가
                this.data.senderSign = this.drawEvent;
                this.data.senderSign[0].signedTime = convertDate

                console.log(this.data)

                this.contractMngmtService.signContract(this.data).subscribe( 
					(data: any) => {
						console.log(data);
						if(data.message == 'Success signed contract') {
							// this.getCompanyHolidayList();
                            this.dialogRef.close();
                            this.router.navigate(['/leave/contract-mngmt/contract-list']);
                        
						}
					},
					(err: any) => {
						if (err.error.message == 'Confirm signed contract Error'){
							this.dialogService.openDialogNegative('An error has occurred.');
						}
					}
				);
			}
		});
    }
}
