import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentagreementComponent } from './investmentagreement.component';

describe('InvestmentagreementComponent', () => {
  let component: InvestmentagreementComponent;
  let fixture: ComponentFixture<InvestmentagreementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentagreementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentagreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
