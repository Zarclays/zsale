import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenLockComponent } from './token-lock.component';

describe('TokenLockComponent', () => {
  let component: TokenLockComponent;
  let fixture: ComponentFixture<TokenLockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenLockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenLockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
