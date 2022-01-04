import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { SignInGuard } from './services/auth/signIn.guard';

const routes: Routes = [
    { path: '',	component: IndexComponent, canActivate: [SignInGuard] },
    {
        path: 'sign-in',
        loadChildren: () =>
            import(`./components/auth/auth.module`).then(m => m.AuthModule),
    },
    {
        path: 'sign-up',
        loadChildren: () =>
            import(`./components/auth/auth.module`).then(m => m.AuthModule),
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
