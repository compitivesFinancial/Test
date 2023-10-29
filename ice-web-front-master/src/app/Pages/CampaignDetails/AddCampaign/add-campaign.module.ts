import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { AddCampaignComponent } from './add-campaign.component';












const ChildRoutes: Routes = [
  {
    path: 'add-campaign',
    component:AddCampaignComponent
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
    AddCampaignComponent,
  ]
})
export class AddCampaignModule { }
