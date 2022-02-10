import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditEmployeeInfoComponent } from './edit-employee-info/edit-employee-info.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeLeaveStatusComponent } from './employee-leave-status/employee-leave-status.component';
import { EmployeeCompanyRequestComponent } from './employee-company-request/employee-company-request.component';
import { RetiredEmployeeListComponent } from './retired-employee-list/retired-employee-list.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'employee-list',
				component: EmployeeListComponent
			},
			{
				path: 'manager-list',
				component: EmployeeListComponent
			},
			{
				path: 'edit-info/:id',
				component: EditEmployeeInfoComponent
			},
			{
				path: 'employee-leave-status',
				component: EmployeeLeaveStatusComponent
			},
			{
				path: 'employee-company-request',
				component: EmployeeCompanyRequestComponent
			},
			{
				path: 'retired-employee-list',
				component: RetiredEmployeeListComponent
			}
		]
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class EmployeeManagementRoutingModule { }
