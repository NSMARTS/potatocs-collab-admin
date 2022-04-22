import { Component, OnInit } from '@angular/core';
import { ViewInfoService } from 'src/@dw/services/contract-mngmt/store/view-info.service';
import { ZoomService } from 'src/@dw/services/contract-mngmt/zoom/zoom.service';

@Component({
  selector: 'app-board-fabs',
  templateUrl: './board-fabs.component.html',
  styleUrls: ['./board-fabs.component.scss']
})
export class BoardFabsComponent implements OnInit {

    constructor(
        private viewInfoService: ViewInfoService,
        private zoomService: ZoomService
    
      ) { }
    
      ngOnInit(): void {
    
      }
    
    
      /**
       * Zoom Button에 대한 동작
       * - viewInfoService의 zoomScale 값 update
       *
       * @param action : 'fitToWidth' , 'fitToPage', 'zoomIn', 'zoomOut'
       */
      clickZoom(action:any){
        console.log(">> Click Zoom: ", action);
    
        const docNum = this.viewInfoService.state.pageInfo.currentDocNum;
        const currentPage = this.viewInfoService.state.pageInfo.currentPage;
        const prevZoomScale = this.viewInfoService.state.pageInfo.zoomScale;
    
        const newZoomScale = this.zoomService.calcZoomScale(action, docNum, currentPage, prevZoomScale);
    
        this.viewInfoService.updateZoomScale(newZoomScale);
    
      }
    
    }
    