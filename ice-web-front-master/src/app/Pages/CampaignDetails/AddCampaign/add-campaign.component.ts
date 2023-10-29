import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { campaign_data } from 'src/app/Shared/Models/campaign.model';
import firebase from 'firebase/app';
import 'firebase/storage';
import { Subscription } from 'rxjs';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { LkServiceService } from 'src/app/Shared/Services/lk-service.service';
import { FundUse } from 'src/app/Shared/Models/fund-use';
import { LoginService } from 'src/app/Shared/Services/login.service';

@Component({
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.css']
})
export class AddCampaignComponent implements OnInit {
  err: boolean = false;
  load: boolean = false;
  campaign_details: any = { "introduce_team": '1' };
  errors: any = {};
  initialTeam = { "name": "", "designation": "", "image": "" }
  teams: any = [{ ...this.initialTeam }]
  campaign_images: any = [];
  campaign_images_files = [];
  image_count: number = 0;
  uploaded_count: number = 0;
  upload_called: boolean = false;
  subscriptions: Subscription[] = [];
  LANG: any = {};
  financingType: any;
  financingPeriod: any;
  fundUseList: Array<FundUse> = [];

  constructor(private toast: ToastrService, private campaign_service: CampaignService, private router: Router, private shared: SharedService, private lkService: LkServiceService,private loginService:LoginService) {
    this.subscriptions.push(this.shared.languageChange.subscribe((path: any) => {
      this.changeLanguage();
    }))
    this.changeLanguage();
    this.financingPeriod = this.lkService.getFinancingPeriod();
    this.financingType = this.lkService.getFinancingTyp();
    this.fundUseList = this.lkService.getFundUseList();
  }

  ngOnInit(): void {
    this.financingPeriod = this.lkService.getFinancingPeriod();
    this.financingType = this.lkService.getFinancingTyp();
  }

  addEmployees() {
    this.teams.push({ ...this.initialTeam })
  }

  changeLanguage() {
    if (localStorage.getItem("arabic") == "true" && localStorage.getItem("arabic") != null) {
      this.LANG = environment.arabic_translations;
    }
    else {
      this.LANG = environment.english_translations;
    }
  }

  showFileInput(id: string) {
    const fileInput = document.getElementById(id) as HTMLInputElement;
    fileInput.click()
  }

  addCampaign() {
    this.err = false;
    this.errors = {};
    this.errorHandler();
    if (this.err) return;
    this.load = true;
    if (this.campaign_images.length > 0) {
      this.campaign_images.map((data: any) => {
        if (data.file) {
          this.uploadImage(data);
          this.image_count += 1;
        }
      })
    }
    if (!this.err && !this.upload_called) {
      this.add();
    }
  }

  errorHandler() {
    if (this.campaign_details.tagline == "" || this.campaign_details.tagline == undefined) {
      this.errors.tagline = true;
      this.err = true;
    }
    if (this.campaign_details.share_price == "" || this.campaign_details.share_price == undefined) {
      this.campaign_details.share_price = 1000;
      // this.errors.share_price=true;
      // this.err=true;
    }
    if (this.campaign_details.total_valuation == "" || this.campaign_details.total_valuation == undefined || this.campaign_details.total_valuation <= 0) {
      this.errors.total_valuation = true;
      this.err = true;
    }
    if (this.campaign_details.financing_type == "" || this.campaign_details.financing_type == undefined) {
      this.errors.financing_type = true;
      this.err = true;
    }
    if (this.campaign_details.fund_use == "" || this.campaign_details.fund_use == undefined) {
      this.errors.fund_use = true;
      this.err = true;
    }
    if (this.campaign_details.financing_period == "" || this.campaign_details.financing_period == undefined) {
      this.errors.financing_period = true;
      this.err = true;
    }
    if (this.campaign_details.obtain_finance_dt == "" || this.campaign_details.obtain_finance_dt == undefined) {
      this.errors.obtain_finance_dt = true;
      this.err = true;
    }
    if (this.campaign_details.finance_repayment_dt == "" || this.campaign_details.finance_repayment_dt == undefined) {
      this.errors.finance_repayment_dt = true;
      this.err = true;
    }
    if (this.campaign_details.company_bio == "" || this.campaign_details.company_bio == undefined) {
      this.errors.company_bio = true;
      this.err = true;
    }
    if (this.campaign_details.reason_to_invest == "" || this.campaign_details.reason_to_invest == undefined) {
      this.errors.reason_to_invest = true;
      this.err = true;
    }
    if (this.campaign_details.investment_planning == "" || this.campaign_details.investment_planning == undefined) {
      this.errors.investment_planning = true;
      this.err = true;
    }
    if (this.campaign_details.terms == "" || this.campaign_details.terms == undefined) {
      this.errors.terms = true;
      this.err = true;
    }

    if (this.campaign_images.length == 0) {
      this.errors.campaign_image_error = true;
      this.err = true;
    }

    this.teamsErrors();
  }

  teamsErrors() {
    this.teams.map((data: any) => {
      if (data.name == "" || data.name == undefined) {
        data.name_error = true;
        this.err = true;
      } else {
        data.name_error = false;

      }
      if (data.designation == "" || data.designation == undefined) {
        data.designation_error = true;
        this.err = true;
      } else {
        data.designation_error = false;
      }
      if (!this.err && data.file) {
        this.image_count += 1;
        this.uploadImage(data)
      }
    })
  }


  changeImage(event: any, data: any) {
    let file = event.target.files[0];
    let ext = file.type.split('/').pop().toLowerCase();
    if (ext !== "jpeg" && ext !== "jpg" && ext !== "png") {
      this.toast.warning("", file.name + "is not a valid file")
      return false
    }
    if (file) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        data.image = e.target.result;
        data.file = file;
      }
      reader.readAsDataURL(file);
    }
    return
  }

  changeImageFile(event: any) {
    let files = event.target.files;
    let newLength = files.length + this.campaign_images.length
    if (files.length > 3) {
      this.toast.warning("Cannot Add more than 3 Images.")
      return false;
    }
    if (newLength > 3) {
      this.toast.warning("Cannot Add more than 3 Images.")
      return false;
    }
    if (files) {
      for (let i = 0; i < files.length; i++) {
        let ext = files[i].type.split('/').pop().toLowerCase();
        if (ext !== "jpeg" && ext !== "jpg" && ext !== "png" && ext !== "pdf") {
          this.toast.warning(files[i].name + " is not a valid File!")
          continue
        }



        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.campaign_images.push({ image: e.target.result, "file": files[i], "extension": ext });

        }
        reader.readAsDataURL(files[i]);
        this.errors.campaign_image_error = false;

      }
    }
    return
  }

  uploadImage(data: any) {
    this.load = true;
    this.upload_called = true;
    var n = Date.now();
    var fileName = data.file.name;
    var path = fileName + n
    const filePath = `Kyc/${path}`;
    this.load = true;
    this.shared.currentUserStatus.subscribe((isLoggedIn) => {
      if (isLoggedIn == true && this.loginService.getToken() !== null) {
        const uploadTask =
          firebase.storage().ref().child(`${filePath}`).put(data.file);
        uploadTask.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          snapshot => {
            const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            data.progress = progress
          },
          //error => console.log(error),
          error => error,
          async () => {
            await uploadTask.snapshot.ref.getDownloadURL().then(res => {
              data.image = res;
              this.uploaded_count += 1;
              if (this.image_count == this.uploaded_count) {
                this.add();
              }
            });
          }
        );
      }
    });
  }
  add() {
    const data: campaign_data = {
      "tagline": this.campaign_details.tagline,
      "share_price": "1000",
      "total_valuation": this.campaign_details.total_valuation,
      // "min_investment": this.campaign_details.min_investment,
      // "max_investment": this.campaign_details.max_investment,
      "campaign_images": this.campaign_images,
      "team": this.teams,
      "company_bio": this.campaign_details.company_bio,
      "reason_to_invest": this.campaign_details.reason_to_invest,
      "investment_planning": this.campaign_details.investment_planning,
      "terms": this.campaign_details.terms,
      "introduce_team": this.campaign_details.introduce_team,
      "financing_type": this.campaign_details.financing_type,
      "fund_use": this.campaign_details.fund_use,
      "financing_period": this.campaign_details.financing_period,
      "obtain_finance_dt": this.campaign_details.obtain_finance_dt,
      "finance_repayment_dt": this.campaign_details.finance_repayment_dt,

    }
    this.subscriptions.push(this.campaign_service.addCampaign(data).subscribe((res: any) => {
      this.load = false;
      if (res.status) {
        this.toast.success("Campaign added successfully!");
        this.router.navigate(["/thank-you"]);
        return
      }
      this.toast.warning(res.response.message);
    }))
  }

  onlyNumbers(event: any) {
    var keycode = (event.which) ? event.which : event.keyCode;
    if ((keycode < 48 || keycode > 57) && keycode !== 13 || keycode == 46) {
      event.preventDefault();
      return false;
    }

    return
  }

}
