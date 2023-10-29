import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { CampaignListComponent } from './campaign-list.component';
import { IvyCarouselModule } from 'angular-responsive-carousel';
// import { NgxSliderModule } from '@angular-slider/ngx-slider';
// import { SliderAngularModule } from 'slider-angular';











const ChildRoutes: Routes = [
  {
    path: 'campaign-list',
    component:CampaignListComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
    LoaderModule,
    
    
  ],
  declarations:[
    CampaignListComponent
  ]
})
export class CampiagnListModule { }
