import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment';
declare const $:any;
@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.css']
})
export class StatementsComponent implements OnInit {
  borrower_statement:any=[];
  borrowerStatement:any;
  investorStatement:any;
  subscriptions:Subscription[]=[];
  user_data:any={};
  LANG: any = "";

  constructor(private shared: SharedService,private statmentsService:StatementsService,private toast:ToastrService,public decryptAES:decryptAesService) {
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){
      this.user_data=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
    }
  
    this.subscriptions.push(this.shared.languageChange.subscribe((path: any) => {
      this.changeLanguage();
    }))
    this.changeLanguage();
  }
  changeLanguage() {
    if (localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
      this.LANG = environment.arabic_translations;
    }
    else {
      this.LANG = environment.english_translations;
    }
    this.shared.getLang().subscribe(lang => {
      if(lang=='ar'){
        this.LANG = environment.arabic_translations;
      }
      else {
        this.LANG = environment.english_translations;
        
      }
    });
  }
  ngOnInit(): void {
    this.getBorrowerStatements();
    this.getInvestorStatements();
    this.getStatements()
  }

  getStatements(){
    const data={user_id:this.user_data.id}
    this.subscriptions.push(this.statmentsService.getStatements(data).subscribe((res:any)=>{
      this.borrower_statement=res.response;
      for(let i=0;i< this.borrower_statement.length; i++){
        if(+this.borrower_statement[i].principle_due > 0){
          this.borrower_statement[i].show_pay_btn=true;
          break
        }
      }

      setTimeout(() => {
        $('#borrowers').DataTable({
          ordering: false,
          responsive: true,

        });
      }, 100);
    }))
  }

  payLoan(item:any,i:number){
    const data={user_id:this.user_data.id,id:item.id}
    this.subscriptions.push(this.statmentsService.payLoan(data).subscribe((res:any)=>{
      if(res.status){
          this.toast.success(res.response.message);
          this.borrower_statement[i].show_pay_btn=false;
          this.borrower_statement[i].principle_due=null;
          this.borrower_statement[i+1] ? this.borrower_statement[i+1].show_pay_btn=true : this.borrower_statement[i+1].show_pay_btn=false;
          return
      }
      this.toast.warning(res.response.message);

    }))
  }

/*********************************************************************************/
getBorrowerStatements(){
  const data={user_id:this.user_data.id}
  this.subscriptions.push(this.statmentsService.getBorrowerStatements(data).subscribe((res:any)=>{
    this.borrowerStatement=res.response;
    setTimeout(() => {
      $('#borrowerStatement').DataTable({
        ordering: false,
        responsive: true,

      });
    }, 100);
  }))
}
/*********************************************************************************/
getInvestorStatements(){
  const data={user_id:this.user_data.id}
  this.subscriptions.push(this.statmentsService.getInvesterStatement(data).subscribe((res:any)=>{
    this.investorStatement=res.response;
    setTimeout(() => {
      $('#investorStatement').DataTable({
        ordering: false,
        responsive: true,

      });
    }, 100);
  }))
}

}
