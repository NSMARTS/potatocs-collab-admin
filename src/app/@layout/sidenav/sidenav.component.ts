import { Component, OnInit } from '@angular/core';
import { NavigationService } from 'src/@dw/services/navigation.service';
@Component({
  selector: 'po-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

	navItems;

	constructor(
		private navigationService: NavigationService,
	) { }

	ngOnInit(): void {
		this.navItems = this.navigationService.items;		
	}
}
