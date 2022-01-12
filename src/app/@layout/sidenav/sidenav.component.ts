import { Component, OnInit } from '@angular/core';
import { SideNavService } from 'src/@dw/services/side-nav/side-nav-service.service';
import { DataService } from 'src/@dw/store/data.service';
import { NavigationService } from 'src/@dw/services/navigation.service';
@Component({
  selector: 'po-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

	navItems;
	user;

	constructor(
		private navigationService: NavigationService,
		private sideNavService: SideNavService,
	) { }

	ngOnInit(): void {
		
		this.sideNavService.updateSideMenu().subscribe(
			(data: any) => {
				this.navItems = this.navigationService.items;
			},
			(err: any) => {
				console.log('sideNavService error', err);
			}
		);

		
	}
}
