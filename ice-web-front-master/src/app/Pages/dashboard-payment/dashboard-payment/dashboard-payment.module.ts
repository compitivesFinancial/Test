import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { DashboardPaymentComponent } from '../dashboard-payment.component';

const routes:Routes=[
  {
    path: 'payment',
    component:DashboardPaymentComponent
  }

]


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class DashboardPaymentModule { }
