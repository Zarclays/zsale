import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchpadDetailComponent } from './launchpad-detail.component';

describe('LaunchpadDetailComponent', () => {
  let component: LaunchpadDetailComponent;
  let fixture: ComponentFixture<LaunchpadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchpadDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchpadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
