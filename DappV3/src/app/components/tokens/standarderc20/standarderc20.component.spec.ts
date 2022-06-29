import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Standarderc20Component } from './standarderc20.component';

describe('Standarderc20Component', () => {
  let component: Standarderc20Component;
  let fixture: ComponentFixture<Standarderc20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Standarderc20Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Standarderc20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
