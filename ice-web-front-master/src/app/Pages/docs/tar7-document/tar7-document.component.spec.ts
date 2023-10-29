import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tar7DocumentComponent } from './tar7-document.component';

describe('Tar7DocumentComponent', () => {
  let component: Tar7DocumentComponent;
  let fixture: ComponentFixture<Tar7DocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tar7DocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tar7DocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
