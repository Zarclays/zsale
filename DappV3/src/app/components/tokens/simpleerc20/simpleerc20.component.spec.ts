import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Simpleerc20Component } from './simpleerc20.component';

describe('Simpleerc20Component', () => {
  let component: Simpleerc20Component;
  let fixture: ComponentFixture<Simpleerc20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Simpleerc20Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Simpleerc20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
