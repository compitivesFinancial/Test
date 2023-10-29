import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { ActiveWalletDetailsComponent } from './active-wallet-details.component';












const ChildRoutes: Routes = [
  {
    path: 'wallet-details',
    component:ActiveWalletDetailsComponent
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
    ActiveWalletDetailsComponent,
  ]
})
export class ActiveWalletDetailsModule { }
