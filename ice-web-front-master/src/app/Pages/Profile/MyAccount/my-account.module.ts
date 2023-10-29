import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { MyAccountComponent } from './my-account.component';












const ChildRoutes: Routes = [
  {
    path: 'my-profile',
    component:MyAccountComponent
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
    MyAccountComponent,
  ]
})
export class MyAccountModule { }
