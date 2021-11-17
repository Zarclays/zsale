import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchpadListComponent } from './launchpad-list.component';

describe('LaunchpadListComponent', () => {
  let component: LaunchpadListComponent;
  let fixture: ComponentFixture<LaunchpadListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LaunchpadListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchpadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
