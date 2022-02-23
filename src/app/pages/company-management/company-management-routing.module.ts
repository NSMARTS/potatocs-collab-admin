import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompanyHolidayListComponent } from './company-holiday-list/company-holiday-list.component';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'company-holiday-list',
				component: CompanyHolidayListComponent,
			},
			
		]
	}

];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CompanyManageMentRoutingModule { }
