import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboarddetailsComponent } from './dashboarddetails.component';

describe('DashboarddetailsComponent', () => {
  let component: DashboarddetailsComponent;
  let fixture: ComponentFixture<DashboarddetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboarddetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboarddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
