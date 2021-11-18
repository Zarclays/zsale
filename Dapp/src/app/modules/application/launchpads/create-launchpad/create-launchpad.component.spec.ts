import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLaunchpadComponent } from './create-launchpad.component';

describe('CreateLaunchpadComponent', () => {
  let component: CreateLaunchpadComponent;
  let fixture: ComponentFixture<CreateLaunchpadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLaunchpadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLaunchpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
