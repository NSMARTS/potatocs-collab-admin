import { Injectable } from '@angular/core';
import { Store } from './store';


class InitViewInfo {
  contractInfo = []; // {_id: '',  currentPage: 1,  numPages: 1}
  isDocLoaded: false;
  loadedDate =  new Date().getTime();
  numPages = 1;
  currentPage = 1;
  zoomScale = 1;
  thumbUpdateRequired: false;
}


@Injectable({
  providedIn: 'root'
})

export class ViewInfoService extends Store<any> {

  constructor() {
    super(new InitViewInfo());
  }

  setViewInfo(data: any): void {
    this.setState({
      ...this.state, ...data
    });
  }


  /**
   *  init setView Info   * 
   * 
   */
  /**
   * Update Zoom Scale
   * @param
   * @param Zoom
   */
   updateDocReady(isReady): void {
    this.setState({
      ...this.state, isDocLoaded: isReady
    })
  }


  /**
   * 페이지 변경에 따른 Data Update
   *
   * @param pageNum 페이지 번호
   */
   updateCurrentPageNum(pageNum: any): void {

    this.state.contractInfo.currentPage = pageNum;

    this.setState({
      ...this.state, currentPage: pageNum
    })
  }


  /**
   * Update Zoom Scale
   * @param
   * @param Zoom
   */
  updateZoomScale(newZoomScale): void {
    this.setState({
      ...this.state, zoomScale: newZoomScale
    })
  }

}
