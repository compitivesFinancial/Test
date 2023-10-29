import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifiedInvestorComponent } from './qualified-investor.component';

describe('QualifiedInvestorComponent', () => {
  let component: QualifiedInvestorComponent;
  let fixture: ComponentFixture<QualifiedInvestorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualifiedInvestorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifiedInvestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
