import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { AddKycComponent } from './add-kyc.component';












const ChildRoutes: Routes = [
  {
    path: 'add-kyc',
    component:AddKycComponent
  },
  {
    path: 'kyc-details',
    component:AddKycComponent
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
    AddKycComponent,
  ]
})
export class AddKYCModule { }
