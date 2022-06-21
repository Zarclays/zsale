import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Burnmintableerc20Component } from './burnmintableerc20.component';

describe('Burnmintableerc20Component', () => {
  let component: Burnmintableerc20Component;
  let fixture: ComponentFixture<Burnmintableerc20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Burnmintableerc20Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Burnmintableerc20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
