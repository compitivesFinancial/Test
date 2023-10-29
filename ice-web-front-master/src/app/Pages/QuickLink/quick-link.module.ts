import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';
import { QuickLinkComponent } from './quick-link.component';












const ChildRoutes: Routes = [
  {
    path: 'quick-link',
    component:QuickLinkComponent
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
    QuickLinkComponent,
  ]
})
export class QuickLinkModule { }
