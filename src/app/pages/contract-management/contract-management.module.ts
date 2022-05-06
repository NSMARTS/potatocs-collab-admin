import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractUploadComponent } from './contract-upload/contract-upload.component';
import { ContractManageMentRoutingModule } from './contract-management-routing.module';

import { DragScrollDirective } from 'src/@dw/directives/drag-scroll.directive';
import { BoardCanvasComponent } from './contract-upload/white-board/board-canvas/board-canvas.component';
import { BoardFabsComponent } from './contract-upload/white-board/board-fabs/board-fabs.component';
import { BoardNavComponent } from './contract-upload/white-board/board-nav/board-nav.component';
import { BoardSlideViewComponent } from './contract-upload/white-board/board-slide-view/board-slide-view.component';
import { IconModule } from '@visurel/iconify-angular';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { ContractSaveComponent } from './contract-upload/contract-save/contract-save.component';
import { ContractSignComponent } from './contract-upload/contract-sign/contract-sign.component';





@NgModule({
    declarations: [
        ContractListComponent,
        ContractUploadComponent,
        BoardCanvasComponent,
        BoardFabsComponent,
        BoardNavComponent,
        BoardSlideViewComponent,
        ContractSaveComponent,
        DragScrollDirective,
        ContractSignComponent,
    ],
    imports: [
        CommonModule,
        NgMaterialUIModule,
        ContractManageMentRoutingModule,
        IconModule
    ]
})
export class ContractManagementModule { }
