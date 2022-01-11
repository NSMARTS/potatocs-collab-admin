import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { SignInGuard } from '../@dw/guard/signIn.guard';
import { CollaborationComponent } from './@layout/collaboration.component';

const routes: Routes = [
    { 
        path: '',
        component: IndexComponent,
        canActivate: [SignInGuard] 
    },
    {
        path: 'sign-in',
        loadChildren: () =>
            import(`./pages/auth/auth.module`).then(m => m.AuthModule),
    },
    {
        path: 'sign-up',
        loadChildren: () =>
            import(`./pages/auth/auth.module`).then(m => m.AuthModule),
    },
    {
        path: 'profile',
        loadChildren: () => import(`./pages/profile-edit/profile-edit.module`).then(m => m.ProfileEditModule),
    },
    {
		path: 'leave',
		component: CollaborationComponent,
		canActivate: [SignInGuard],
        children: [
			{
				path: 'main',
				loadChildren: () => import(`./pages/main/main.module`).then(m => m.MainModule),
			},
            {
                path: 'employee-mngmt',
                loadChildren: () => import('./pages/employee-management/employee-management.module').then(m => m.EmployeeManagementModule)
            }
        ]
    },
    // 잘못된 URL을 사용했을때 메인으로 보냄
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    },
];

@NgModule({
    // imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'})],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class ApproutingModule {}
