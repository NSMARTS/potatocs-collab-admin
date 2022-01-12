// MODULE
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { LeaveRequestDetailsComponent } from '../components/leave-request-details/leave-request-details.component';

// COMPONENT

@NgModule({
  declarations: [
    LeaveRequestDetailsComponent
  ],
  imports: [
    CommonModule,
    NgMaterialUIModule,
  ],
})
export class CollaborationModule { }
