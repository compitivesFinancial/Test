import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { InvestorWalletComponent } from './investor-wallet.component';












const ChildRoutes: Routes = [
  {
    path: 'my-profile/operations',
    component:InvestorWalletComponent
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
    InvestorWalletComponent,
  ]
})
export class InvestorWalletModule { }
