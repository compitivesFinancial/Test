import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { LoaderModule } from 'src/app/Shared/Components/Loader/loader.module';












const ChildRoutes: Routes = [
  {
    path: 'register',
    component:RegistrationComponent
  },
  
  ]

@NgModule({
  imports: [
    RouterModule.forChild(ChildRoutes),
    FormsModule,
    CommonModule,
    LoaderModule,
    ReactiveFormsModule
  ],
  declarations:[
    RegistrationComponent,
  ]
})
export class RegistrationModule { }
