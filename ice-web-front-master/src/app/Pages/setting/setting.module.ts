import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting.component';
import { OperationdetailsComponent } from './operationdetails/operationdetails.component';
import { NgCircleProgressModule } from 'ng-circle-progress';


const ChildRoutes: Routes = [
  {
    path: 'setting',
    component:SettingComponent
  },
  {
    path:'operationdetails/:id',
    component:OperationdetailsComponent
  }
  
  ]

@NgModule({
  declarations: [
    OperationdetailsComponent,
    
  ],
  imports: [
    RouterModule.forChild(ChildRoutes),
    CommonModule,
   
    
  ]
})
export class SettingModule { }
