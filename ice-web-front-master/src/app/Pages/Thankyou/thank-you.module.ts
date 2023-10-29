import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThankYouComponent } from './thank-you.component';












const ChildRoutes: Routes = [
  {
    path: 'thank-you',
    component:ThankYouComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
  ],
  declarations:[
    ThankYouComponent,
  ]
})
export class ThankYouModule { }
