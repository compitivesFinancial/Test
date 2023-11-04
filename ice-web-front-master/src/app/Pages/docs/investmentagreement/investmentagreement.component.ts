import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { decryptAesService } from 'src/app/Shared/Services/decryptAES.service';
import { StatementsService } from 'src/app/Shared/Services/statements.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-investmentagreement',
  templateUrl: './investmentagreement.component.html',
  styleUrls: ['./investmentagreement.component.css'],
})
export class InvestmentagreementComponent implements OnInit {
  @ViewChild('navContent',{static:false}) navContent!:ElementRef;
  public pageDetail: any = {};
  subscriptions: Subscription[] = [];
  LANG = environment.english_translations;
  session_user: any = {};
  investorAddress: any;
  myDate: any;
  pagePrint:any;
  /*****************************************************************/
  constructor(
    private datePipe: DatePipe,
    private campaign_service: CampaignService,
    private statement: StatementsService,public decryptAES:decryptAesService
  ) {
    this.myDate = new Date();
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
    const user_data = btoa(btoa('user_info_web'));
    if (localStorage.getItem(user_data) != undefined) {
      this.session_user = JSON.parse(
        atob(atob(localStorage.getItem(user_data) || '{}'))
      );
    }
    /*****************************************************************/
    this.statement.getPageDetails('2', '').subscribe((data: any) => {
      if (data.status) {
        this.pageDetail = data.response;
      }
    });
    this.campaign_service.getUserKycAddress().subscribe((data: any) => {
      if (data.status) {
        this.investorAddress = data.response;
      }
    });
    // );
  }
  /*****************************************************************/
  ngOnInit(): void {}
  /*****************************************************************/
}
