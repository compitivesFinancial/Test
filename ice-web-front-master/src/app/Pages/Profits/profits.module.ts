import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { ProfitsComponent } from './profits.component';












const ChildRoutes: Routes = [
  {
    path: 'profit',
    component:ProfitsComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
    LoaderModule
  ],
  declarations:[
    ProfitsComponent,
  ]
})
export class ProfitsModule { }
