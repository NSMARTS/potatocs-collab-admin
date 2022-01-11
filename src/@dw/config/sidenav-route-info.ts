// rounting info
import { NavigationItem } from '../interfaces/navigation-item.interface'
export const sidenavRouteInfo: NavigationItem[] = [
	// dashboard
	{
		type: 'link',
		label: 'Dashboard',
		route: 'main',
		icon: 'dashboard',
	},
	// Leave
	{
		type: 'subheading',
		label: 'Employee Management',
		children: [
			{
				type: 'link',
				label: 'Employee Leave Status',
				route: 'employee-mngmt/employee-leave-status',
				icon: 'receipt_long',
			},
			{
				type: 'link',
				label: 'Employee List',
				route: 'employee-mngmt/manager-list',
				icon: 'list',
			},
			{
				type: 'link',
				label: 'Employee Company Request',
				route: 'employee-mngmt/employee-company-request',
				icon: 'add_business',
			}
		]
	}
];