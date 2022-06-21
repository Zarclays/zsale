import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansTokenComponent } from './plans-token.component';

describe('PlansTokenComponent', () => {
  let component: PlansTokenComponent;
  let fixture: ComponentFixture<PlansTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlansTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlansTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
