// MODULE
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { LeaveRequestDetailsComponent } from '../components/leave-request-details/leave-request-details.component';
import { CompanyComponent } from '../pages/employee-management/retired-employee-list/retired-employee-list.component';

// COMPONENT

@NgModule({
  declarations: [
    LeaveRequestDetailsComponent,
    CompanyComponent
  ],
  imports: [
    CommonModule,
    NgMaterialUIModule,
  ],
})
export class CollaborationModule { }
