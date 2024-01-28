import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { NewHomeComponent } from './home.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/Shared/Services/campaign.service';
import { errorHandlerService } from 'src/app/Shared/Services/errorHandler.service';
import { SharedService } from 'src/app/Shared/Services/shared.service';
import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

fdescribe('NewHomeComponent', () => {
  let component: NewHomeComponent;
  let fixture: ComponentFixture<NewHomeComponent>;
  let mockCampaignService: jasmine.SpyObj<CampaignService>;
  let mockSharedService: jasmine.SpyObj<SharedService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockErrorHandlerService: jasmine.SpyObj<errorHandlerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCampaignService = jasmine.createSpyObj('CampaignService', [
      'getLang', 'getHomeData', 'investmentOppertunityQaysar', 'contactUs'
    ]);

    mockSharedService = jasmine.createSpyObj('SharedService', ['languageChange', 'getLang']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'warning', 'error']);
    mockErrorHandlerService = jasmine.createSpyObj('errorHandlerService', ['getError']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    mockCampaignService = jasmine.createSpyObj('CampaignService', ['getLang', 'getHomeData', 'investmentOppertunityQaysar', 'contactUs']);
    mockSharedService = jasmine.createSpyObj('SharedService', ['languageChange', 'getLang']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'warning', 'error']);
    mockErrorHandlerService = jasmine.createSpyObj('errorHandlerService', ['getError']);
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    const languageChange = new EventEmitter<any>();
    const getLangSpy = jasmine.createSpy('getLang').and.returnValue(of('en'));

    mockSharedService = {
      languageChange,
      getLang: getLangSpy,
    } as any;

    await TestBed.configureTestingModule({
      declarations: [NewHomeComponent],
      providers: [
        { provide: CampaignService, useValue: mockCampaignService },
        { provide: SharedService, useValue: mockSharedService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: errorHandlerService, useValue: mockErrorHandlerService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHomeComponent);
    component = fixture.componentInstance;
  });

  fit('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));
  fit('should check if the upcomingInvestmentOppertunityList is being redered as cards', fakeAsync(() => {
    const card = fixture.debugElement.query(By.css('#cardId')).nativeElement;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(card).toBeDefined();
  }));
  fit('should check if the upcomingInvestmentOppertunityList is not empty', fakeAsync(() => {
    const listOfUpcomingOpportunites = component.upcomingInvestmentOppertunityList;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(listOfUpcomingOpportunites.length).toBeGreaterThan(0);
  }));
});