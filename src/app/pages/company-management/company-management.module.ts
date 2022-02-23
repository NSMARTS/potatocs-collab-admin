import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyManageMentRoutingModule } from './company-management-routing.module';
import { CompanyHolidayListComponent } from './company-holiday-list/company-holiday-list.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { CompanyHolidayAddComponent } from './company-holiday-add/company-holiday-add.component';




@NgModule({
	declarations: [
		CompanyHolidayListComponent,
		CompanyHolidayAddComponent,

	],
	imports: [
		CommonModule,
		NgMaterialUIModule,
		CompanyManageMentRoutingModule,
	],
})
export class CompanyManageMentModule { }
