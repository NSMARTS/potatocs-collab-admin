import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EditEmployeeInfoComponent } from './edit-employee-info/edit-employee-info.component';
import { EmployeeLeaveStatusComponent } from './employee-leave-status/employee-leave-status.component';
import { DialogContractSelectComponent, EmployeeCompanyRequestComponent } from './employee-company-request/employee-company-request.component';
import { LeaveRequestDetailsComponent } from 'src/app/components/leave-request-details/leave-request-details.component';


@NgModule({
	declarations: [
		EmployeeListComponent,
		EditEmployeeInfoComponent,
  		EmployeeLeaveStatusComponent,
    	EmployeeCompanyRequestComponent,
		DialogContractSelectComponent
	],
	imports: [
		CommonModule,
		NgMaterialUIModule,
		EmployeeManagementRoutingModule,
	],
	exports: [
    ],
	entryComponents: [
		DialogContractSelectComponent,
		LeaveRequestDetailsComponent
	]
})
export class EmployeeManagementModule { }
