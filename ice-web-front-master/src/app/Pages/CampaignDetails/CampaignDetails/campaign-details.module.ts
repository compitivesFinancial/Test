import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CampaignDetailsComponent } from './campaign-details.component';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';












const ChildRoutes: Routes = [
  {
    path: 'campaign-details',
    component:CampaignDetailsComponent
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
    CampaignDetailsComponent,
  ]
})
export class CampaignDetailsModule { }
