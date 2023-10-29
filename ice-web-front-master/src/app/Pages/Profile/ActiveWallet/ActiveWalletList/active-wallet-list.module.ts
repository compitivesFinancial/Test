import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { ActiveWalletListComponent } from './active-wallet-list.component';


const ChildRoutes: Routes = [
  {
    path: 'wallet',
    component:ActiveWalletListComponent
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
    ActiveWalletListComponent,
  ]
})
export class ActiveWalletListModule { }
