import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PendingRequestComponent } from './pending-request/pending-request.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'pending-request',
				component: PendingRequestComponent,
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ApprovalManagementRoutingModule { }
