import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenMinterComponent } from './token-minter.component';

describe('TokenMinterComponent', () => {
  let component: TokenMinterComponent;
  let fixture: ComponentFixture<TokenMinterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenMinterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenMinterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
