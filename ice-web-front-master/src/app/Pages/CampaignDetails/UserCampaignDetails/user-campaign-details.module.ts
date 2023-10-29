import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { UserCampaignDetailsComponent } from './user-campaign-details.component';












const ChildRoutes: Routes = [
  {
    path: 'user-campaign-details',
    component:UserCampaignDetailsComponent
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
    UserCampaignDetailsComponent,
  ]
})
export class UserCampaignDetailsModule { }
