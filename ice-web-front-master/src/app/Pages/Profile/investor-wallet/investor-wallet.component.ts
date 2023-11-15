import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment';
declare const $:any;
@Component({
  selector: 'app-investor-wallet',
  templateUrl: './investor-wallet.component.html',
  styleUrls: ['./investor-wallet.component.css']
})
export class InvestorWalletComponent implements OnInit {
  wallet_statement:any=[];
  subscriptions:Subscription[]=[];
  LANG:any={};
  user_data:any={};
  data_loaded:boolean=false;
  borrower_statement_details:any=[];
  data_table:any;
  investor_statement_details:any=[];
  data_loaded_investor:boolean=false;
  data_loaded_borrower:boolean=false;

  constructor(private statmentsService:StatementsService,private toast:ToastrService,private shared:SharedService,public decryptAES:decryptAesService) { 
    const user_data=btoa(btoa("user_info_web"));
    if(localStorage.getItem(user_data) != undefined){
      this.user_data=JSON.parse(atob(atob(localStorage.getItem(user_data) || '{}')));
    }
    
    this.subscriptions.push(this.shared.languageChange.subscribe((path:any)=>{
      this.changeLanguage();
    }))
    this.changeLanguage();
  }

  
  changeLanguage(){
    if(localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
        this.LANG=environment.arabic_translations;
    }
    else {
        this.LANG=environment.english_translations;
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
    if(this.user_data.role_type == 2){
      this.getInvestorWallet();
      return
    }
    this.getBorrowersWallet();
  }

  getInvestorWallet(){
    const data={user_id:this.user_data.id}
    this.subscriptions.push(this.statmentsService.getInvestorWallet(data).subscribe((res:any)=>{
      this.wallet_statement=res.response;
      this.data_loaded=true;
    }))
  }

  getBorrowersWallet(){
    const data={user_id:this.user_data.id}

    this.subscriptions.push(this.statmentsService.getBorrowersWallet(data).subscribe((res:any)=>{
      this.wallet_statement=res.response;
      this.data_loaded=true;
      
      
    }))
  }

  payLoan(item:any,i:number){
    const data={user_id:this.user_data.id,id:item.id}
    this.subscriptions.push(this.statmentsService.payLoan(data).subscribe((res:any)=>{
      if(res.status){
          this.toast.success(res.response.message);
          this.borrower_statement_details[i].show_pay_btn=false;
          this.borrower_statement_details[i].principle_due=null;
          this.borrower_statement_details[i+1] ? this.borrower_statement_details[i+1].show_pay_btn=true : this.borrower_statement_details[i+1].show_pay_btn=false;
          return
      }
      this.toast.warning(res.response.message);

    }))
  }

  view(data:any){
    this.borrower_statement_details=[];
    this.borrower_statement_details=data.borrower_statement;
    this.data_loaded_borrower=true;
    for(let i=0;i< this.borrower_statement_details.length; i++){
      if(+this.borrower_statement_details[i].principle_due > 0){
        this.borrower_statement_details[i].show_pay_btn=true;
        break
      }
    }
    if(this.data_table){
      this.data_table.destroy();
    }
    setTimeout(() => {   
      this.data_table=$('#borrowers_statement').DataTable({
        ordering: false,
        responsive: true,
      });
      $('html, body').animate({
        'scrollTop' : $("#borrowers_statement").position().top + 100
      });
    }, 100);
  }

  viewInvestorData(data:any){
    this.investor_statement_details=[];
    this.investor_statement_details=data.investor_statement;
    this.data_loaded_investor=true;
  
    setTimeout(() => {   
      $('html, body').animate({
        'scrollTop' : $("#investors_statement").position().top + 100
      });

    }, 100);
  }
  

}
