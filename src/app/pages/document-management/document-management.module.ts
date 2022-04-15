import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentManageMentRoutingModule } from './document-management-routing.module';



@NgModule({
  declarations: [
      DocumentListComponent,
      DocumentUploadComponent      
  ],
  imports: [
    CommonModule,
    NgMaterialUIModule,
    DocumentManageMentRoutingModule
  ]
})
export class DocumentManagementModule { }
