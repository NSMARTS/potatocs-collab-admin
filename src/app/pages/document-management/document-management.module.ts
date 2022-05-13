import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentUploadComponent } from './document-upload/document-upload.component';
import { DocumentManageMentRoutingModule } from './document-management-routing.module';
import { DocumentDetailsComponent } from './document-details/document-details.component';



@NgModule({
  declarations: [
      DocumentListComponent,
      DocumentUploadComponent,
      DocumentDetailsComponent      
  ],
  imports: [
    CommonModule,
    NgMaterialUIModule,
    DocumentManageMentRoutingModule
  ]
})
export class DocumentManagementModule { }
