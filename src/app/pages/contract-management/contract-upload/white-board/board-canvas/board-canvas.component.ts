import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, pairwise, pluck, takeUntil } from 'rxjs/operators';
import { CanvasService } from 'src/@dw/services/contract-mngmt/canvas/canvas.service';
import { CANVAS_CONFIG } from 'src/@dw/services/contract-mngmt/config/config';
import { EventBusService } from 'src/@dw/services/contract-mngmt/eventBus/event-bus.service';
import { EventData } from 'src/@dw/services/contract-mngmt/eventBus/event.class';
import { RenderingService } from 'src/@dw/services/contract-mngmt/rendering/rendering.service';
import { PdfStorageService } from 'src/@dw/services/contract-mngmt/storage/pdf-storage.service';
import { ViewInfoService } from 'src/@dw/services/contract-mngmt/store/view-info.service';


@Component({
    selector: 'app-board-canvas',
    templateUrl: './board-canvas.component.html',
    styleUrls: ['./board-canvas.component.scss']
})
export class BoardCanvasComponent implements OnInit {

    private unsubscribe$ = new Subject<void>();


    // static: https://stackoverflow.com/questions/56359504/how-should-i-use-the-new-static-option-for-viewchild-in-angular-8

    @ViewChild('canvasContainer', { static: true }) public canvasContainerRef: ElementRef;
    @ViewChild('bg', { static: true }) public bgCanvasRef: ElementRef;
    @ViewChild('tmp', { static: true }) public tmpCanvasRef: ElementRef;


    canvasContainer: HTMLDivElement;
    bgCanvas: HTMLCanvasElement;
    tmpCanvas: HTMLCanvasElement;

    rendererEvent1: any;

    constructor(
        private viewInfoService: ViewInfoService,
        private canvasService: CanvasService,
        private pdfStorageService: PdfStorageService,
        private renderingService: RenderingService,
        private eventBusService: EventBusService,
        private renderer: Renderer2,

    ) {

    }

    // Resize Event Listener
    @HostListener('window:resize') resize() {
        const newWidth = window.innerWidth - CANVAS_CONFIG.sidebarWidth;
        const newHeight = window.innerHeight;
        // sidenav 열릴때 resize event 발생... 방지용도.
        if (CANVAS_CONFIG.maxContainerWidth === newWidth && CANVAS_CONFIG.maxContainerHeight === newHeight) {
            return;
        }
        CANVAS_CONFIG.maxContainerWidth = newWidth;
        CANVAS_CONFIG.maxContainerHeight = newHeight;
        this.onResize();
    }

    ngOnInit(): void {

        this.initCanvasSet();

        ////////////////////////////////////////////////
        // Document가 Update 된 경우 (zoom, page change 등)
        this.viewInfoService.state$
            .pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
            .subscribe((viewInfo) => {

                console.log(viewInfo)

                if (viewInfo.isDocLoaded) {
                    this.onChangePage();
                }

            });
        /////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////
        // continer scroll
        // thumbnail의 window 처리 용도
        this.rendererEvent1 = this.renderer.listen(this.canvasContainer, 'scroll', event => {
            this.onScroll();
        });
        //////////////////////////////////////////////////

    }
    // end of ngOnInit 



    ngOnDestroy() {

        this.unsubscribe$.next();
        this.unsubscribe$.complete();

        // render listener 해제
        this.rendererEvent1();

        // pdf memory release
        this.pdfStorageService.memoryRelease();
        this.viewInfoService.updateDocReady(false);

    }


    /**
     * 초기 Canvas 변수, Container Size 설정
     */
    initCanvasSet() {


        this.bgCanvas = this.bgCanvasRef.nativeElement;

        this.tmpCanvas = this.tmpCanvasRef.nativeElement;
        this.canvasContainer = this.canvasContainerRef.nativeElement;

        /* container size 설정 */
        CANVAS_CONFIG.maxContainerHeight = window.innerHeight - CANVAS_CONFIG.toolbarHeight - CANVAS_CONFIG.navHeight; // pdf 불러오기 사이즈
        CANVAS_CONFIG.maxContainerWidth = window.innerWidth - CANVAS_CONFIG.sidebarWidth;

        CANVAS_CONFIG.deviceScale = this.canvasService.getDeviceScale(this.bgCanvas);
    }


    /**
     *  판서 + background drawing
     */

    /**
     * draw + pdf rendering
     *
     * @param currentDocNum
     * @param currentPage
     * @param zoomScale
     */
    pageRender(currentPage, zoomScale) {

        // zoomIn 시 UI 측면 화면 깜빡임 방지 함수.
        this.preRenderBackground(currentPage)

        console.log('>>> page Render!');
        // PDF Rendering
        this.renderingService.renderBackground(this.tmpCanvas, this.bgCanvas, currentPage);
    }

    
    /**
     * Background pre rendering
     * - Main bg를 그리기 전에 thumbnail image 기준으로 배경을 미리 그림.
     * - UI 측면의 효과
     * @param pageNum page 번호
     */
    async preRenderBackground(pageNum) {
        console.log(pageNum)
        const targetCanvas = this.bgCanvas

        const ctx = targetCanvas.getContext("2d");
        const imgElement: any = document.getElementById('thumb' + pageNum);

        /**************************************************
        * 처음 화이트보드에 들어오면 document.getElementById('thumb_' + pageNum) (이미지)가 정의되지 않아 오류가 난다.
        * 그래서 img가 null일 시 return 하여 오류 방지
        ****************************************************/
        if(imgElement == null){
            return
        }
      
        ctx.drawImage(imgElement, 0, 0, targetCanvas.width, targetCanvas.height);
    }


    /**
     * 창 크기 변경시
     *
     */
    onResize() {
        if (!this.viewInfoService.state.isDocLoaded) return;

        // Resize시 container size 조절.
        const ratio = this.canvasService.setContainerSize(this.canvasContainer);

        // thumbnail window 크기 변경을 위한 처리.
        this.eventBusService.emit(new EventData("change:containerSize", {
            ratio,
            coverWidth: this.canvasService.canvasFullSize.width,
        }));

    }

    /**
     * Scroll 발생 시
     */
    onScroll() {
        if (!this.viewInfoService.state.isDocLoaded) return;

        this.eventBusService.emit(new EventData('change:containerScroll', {
            left: this.canvasContainer.scrollLeft,
            top: this.canvasContainer.scrollTop
        }))
    }


    /**
       * change Page : 아래 사항에 대해 공통으로 사용
       * - 최초 Load된 경우
       * - 페이지 변경하는 경우
       * - 문서 변경하는 경우
       * - scale 변경하는 경우
       */
    onChangePage() {
        //document Number -> 1부터 시작.
        const pageNum = this.viewInfoService.state.currentPage;
        const zoomScale = this.viewInfoService.state.zoomScale;

        console.log(`>> changePage to page: ${pageNum}, scale: ${zoomScale} `);

        // set Canvas Size
        const ratio = this.canvasService.setCanvasSize(pageNum, zoomScale, this.canvasContainer, this.bgCanvas);

        // BG & Board Render
        this.pageRender(pageNum, zoomScale);

        // Thumbnail window 조정

        this.eventBusService.emit(new EventData('change:containerSize', {
            ratio,
            coverWidth: this.canvasService.canvasFullSize.width,
        }));


        // scroll bar가 있는 경우 page 전환 시 초기 위치로 변경
        this.canvasContainer.scrollTop = 0;
        this.canvasContainer.scrollLeft = 0;
    };


}
