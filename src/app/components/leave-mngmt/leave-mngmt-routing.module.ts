import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveMngmtComponent } from './leave-mngmt.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
	{
		path: 'leave',
		component: LeaveMngmtComponent,
		children: [
			{
				path: '',
				component: MainComponent
			},
			{
				path: 'employee-mngmt',
				loadChildren: () => import('./pages/employee-management/employee-management.module').then(m => m.EmployeeManagementModule)
			},
			{
				path: 'approval-mngmt',
				loadChildren: () => import('./pages/approval-management/approval-management.module').then(m => m.ApprovalManagementModule)
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LeaveMngmtRoutingModule { }
