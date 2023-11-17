import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  templateUrl: './quick-link.component.html',
  styleUrls: ['./quick-link.component.css']
})
export class QuickLinkComponent implements OnInit {
  public id:string="";
  public details:any={};
  LANG:any=""
  users:any={};
  constructor(private statement:StatementsService,private route:ActivatedRoute,private shared:SharedService,public decryptAES:decryptAesService) {
    
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){

      this.users=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));

    }
   
    this.changeLanguage();
    this.route.queryParams
      .subscribe(
        (params: Params) => {
          if(params['id']){
            this.id = atob(atob(params['id']))
            this.getPageDetails();
          }
        }
    )
   }

  ngOnInit(): void {
  }

  changeLanguage(){
    
    this.shared.getLang().subscribe(lang => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
      }
      else {
        this.LANG = environment.english_translations;
        
      }
    });
  }


  // getPageDetails_old(){
  //   const mydata={
  //     "id": this.id,
  //     'user_id':this.users.id
  //     // "country_code": this.country_code
  //   }
  //   this.statement.getPageDetails(this.id,mydata).subscribe((data:any)=>{
  //     if(data.status){
  //       this.details=data.response;
  //     }
  //   })
  // }
  getPageDetails() {
    const mydata = {
      id: this.id,
      user_id: this.users.id,
      // "country_code": this.country_code
    };

    if (this.users.id == null || this.users.id == 'undefined' || this.users.id == '') {
      this.statement.getPageOutDetails(this.id, mydata).subscribe((data: any) => {
        if (data.status) {
          this.details = data.response;
        }
      });
    } else {
      this.statement.getPageDetails(this.id, mydata).subscribe((data: any) => {
        if (data.status) {
          this.details = data.response;
        }
      });
    }
  }

}
