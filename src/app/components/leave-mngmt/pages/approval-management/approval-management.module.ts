import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApprovalManagementRoutingModule } from './approval-management-routing.module';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { DialogContractSelectComponent, PendingRequestComponent } from './pending-request/pending-request.component';


@NgModule({
  declarations: [
    PendingRequestComponent,
    DialogContractSelectComponent,
  ],
  imports: [
    CommonModule,
    NgMaterialUIModule,
    ApprovalManagementRoutingModule
  ],
  entryComponents: [
    DialogContractSelectComponent,
  ]

})
export class ApprovalManagementModule { }
