import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveMngmtRoutingModule } from './leave-mngmt-routing.module';
import { LeaveMngmtComponent } from './leave-mngmt.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { NavService } from 'src/app/services/nav/nav.service';
import { MenuListItemComponent } from './components/menu-list-item/menu-list-item.component';
import { MainComponent } from './pages/main/main.component';
import { LeaveRequestDetailsComponent } from './components/leave-request-details/leave-request-details.component';

import { DialogComponent } from './components/dialog/dialog.component';
import { ConfirmDialogComponent } from 'src/app/components/leave-mngmt/components/dialog/dialog.component';
import { PositiveDialogComponent } from 'src/app/components/leave-mngmt/components/dialog/dialog.component';
import { NegativeDialogComponent } from 'src/app/components/leave-mngmt/components/dialog/dialog.component';

@NgModule({
	declarations: [
		MenuListItemComponent,
		LeaveMngmtComponent,
		MainComponent,
		LeaveRequestDetailsComponent,
		DialogComponent,
		ConfirmDialogComponent,
		PositiveDialogComponent,
		NegativeDialogComponent
	],
	imports: [
		CommonModule,
		NgMaterialUIModule,
		LeaveMngmtRoutingModule
	],
	providers: [
		NavService
	]
})
export class LeaveMngmtModule { }
