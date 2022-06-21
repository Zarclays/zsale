import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TokensRoutingModule } from './tokens-routing.module';
import { TokenMinterComponent } from './token-minter/token-minter.component';
import { ListTokenComponent } from './list-token/list-token.component';
import { PlansTokenComponent } from './plans-token/plans-token.component';
import { Simpleerc20Component } from './simpleerc20/simpleerc20.component';
import { Standarderc20Component } from './standarderc20/standarderc20.component';
import { Burnmintableerc20Component } from './burnmintableerc20/burnmintableerc20.component';
import { TokenLockComponent } from './token-lock/token-lock.component';


@NgModule({
  declarations: [
    TokenMinterComponent,
    ListTokenComponent,
    PlansTokenComponent,
    Simpleerc20Component,
    Standarderc20Component,
    Burnmintableerc20Component,
    TokenLockComponent
  ],
  imports: [
    CommonModule,
    TokensRoutingModule,
    ReactiveFormsModule
  ]
})
export class TokensModule { }
