import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubHeaderMenueComponent } from './sub-header-menue.component';

describe('SubHeaderMenueComponent', () => {
  let component: SubHeaderMenueComponent;
  let fixture: ComponentFixture<SubHeaderMenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubHeaderMenueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubHeaderMenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
