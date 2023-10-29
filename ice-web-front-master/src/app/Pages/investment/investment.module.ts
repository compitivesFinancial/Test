import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InvestmentComponent } from './investment.component';
import { InvestmentdetailsComponent } from './investmentdetails/investmentdetails.component';

const ChildRoutes: Routes = [
  {
    path: 'investment',
    component:InvestmentComponent
  },
  {
    path:'investment/:id',
    component:InvestmentdetailsComponent
  }
  
  ]


@NgModule({
  declarations: [
    InvestmentdetailsComponent,
    InvestmentdetailsComponent
  ],
  imports: [
    RouterModule.forChild(ChildRoutes),
    CommonModule
  ]
})
export class InvestmentModule { }
