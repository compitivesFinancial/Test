import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quick-link',
  templateUrl: './quick-link.component.html',
  styleUrls: ['./quick-link.component.css']
})
export class QuickLinkComponent implements OnInit {
  public id:string="";
  public details:any={};
  users:any={};
  constructor(private statement:StatementsService,private route:ActivatedRoute,public decryptAES:decryptAesService) {
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){

      this.users=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));

    }
  
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
 getPageDetails(){
  const mydata={
    "id": this.id,
    'user_id':this.users.id
    // "country_code": this.country_code
  }
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
    // this.statement.getPageOutDetails(this.id,mydata).subscribe((data:any)=>{
    //   if(data.status){
    //     this.details=data.response;
    //   }
    // })
  }

}
