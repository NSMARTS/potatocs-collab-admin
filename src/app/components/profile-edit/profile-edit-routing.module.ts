import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileEditComponent } from './profile-edit.component';

const routes: Routes = [
  {
    path: 'profile',
    component: ProfileEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileEditRoutingModule { }
