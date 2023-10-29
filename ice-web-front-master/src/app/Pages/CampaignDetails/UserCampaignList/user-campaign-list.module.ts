import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { UserCampaignListComponent } from './user-campaign-list.component';












const ChildRoutes: Routes = [
  {
    path: 'my-profile/user-campaigns',
    component:UserCampaignListComponent
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
    UserCampaignListComponent,
  ]
})
export class UserCampaignListModule { }
