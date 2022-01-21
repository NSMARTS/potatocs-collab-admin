import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileEditComponent } from './profile-edit.component';
import { ProfileEditRoutingModule } from './profile-edit-routing.module';
import { ProfileHeaderComponent } from './profile-header/profile-header.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';


@NgModule({
  declarations: [
    ProfileEditComponent,
    ProfileHeaderComponent
  ],
  imports: [
    CommonModule,
    ProfileEditRoutingModule,
    NgMaterialUIModule
  ]
})

export class ProfileEditModule { }
