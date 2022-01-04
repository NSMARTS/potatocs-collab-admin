import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import { SignInGuard } from 'src/app/services/auth/signIn.guard';

const routes: Routes = [
    { path: 'sign-in', component: SignInComponent, canActivate: [SignInGuard] },
    { path: 'sign-up', component: SignUpComponent, canActivate: [SignInGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
