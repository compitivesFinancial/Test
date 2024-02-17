import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgImageSliderModule } from 'ng-image-slider/public_api';
// import { DashboardPaymentComponent } from '../dashboard-payment/dashboard-payment.component';
import { Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { MultipleOf1000Directive } from './multiple-of-1000.directive';
// import { FormsModule } from '@angular/forms';
// import { DashboardComponent } from './dashboard.component';


// const ChildRoutes: Routes = [
//   {
//     path: '/payment',
//     component:DashboardPaymentComponent
//   }
// ]


@NgModule({
  declarations: [
    // DashboardPaymentComponent
  
    MultipleOf1000Directive
  ],
  imports: [
    CommonModule,
     FormsModule,
     ReactiveFormsModule,
    LoaderModule
    // NgImageSliderModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
