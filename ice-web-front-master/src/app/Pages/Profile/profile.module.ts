import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';









const ChildRoutes: Routes = [
  {
    path: '',
    component:ProfileComponent,
    children: [
      {
        path: '', 
        loadChildren: () => import('./MyAccount/my-account.module').then(m => m.MyAccountModule),
      },
      {
        path: '',
        loadChildren: () => import('../CampaignDetails/UserCampaignList/user-campaign-list.module').then(m => m.UserCampaignListModule),
      },
      
      
      // {
      //   path: '',
      //   loadChildren: () => import('./investor-wallet/investor-wallet.module').then(m => m.InvestorWalletModule),
      // },
      
    ],
  },
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    CommonModule,
    FormsModule,  
    LoaderModule,
  ],
  declarations:[
    ProfileComponent
  ]
})
export class profileModule { }
