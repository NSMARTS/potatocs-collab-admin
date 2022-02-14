import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
		private router: Router,
	) { }

	ngOnInit(): void {
		this.navItems = this.navigationService.items;		
	}

	main() {
		this.router.navigate(['main']);
	}
}
