import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractUploadComponent } from './contract-upload/contract-upload.component';
import { ContractManageMentRoutingModule } from './contract-management-routing.module';

import { DragScrollDirective } from 'src/@dw/directives/drag-scroll.directive';
import { BoardCanvasComponent } from './contract-upload/white-board/board-canvas/board-canvas.component';
import { BoardFabsComponent } from './contract-upload/white-board/board-fabs/board-fabs.component';
import { BoardFileViewComponent } from './contract-upload/white-board/board-file-view/board-file-view.component';
import { BoardNavComponent } from './contract-upload/white-board/board-nav/board-nav.component';
import { BoardSlideViewComponent } from './contract-upload/white-board/board-slide-view/board-slide-view.component';
import { IconModule } from '@visurel/iconify-angular';




@NgModule({
    declarations: [
        ContractListComponent,
        ContractUploadComponent,
        BoardCanvasComponent,
        BoardFabsComponent,
        BoardFileViewComponent,
        BoardNavComponent,
        BoardSlideViewComponent,
        DragScrollDirective
    ],
    imports: [
        CommonModule,
        NgMaterialUIModule,
        ContractManageMentRoutingModule,
        IconModule
    ]
})
export class ContractManagementModule { }
