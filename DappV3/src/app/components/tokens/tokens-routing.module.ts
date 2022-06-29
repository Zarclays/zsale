import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Burnmintableerc20Component } from './burnmintableerc20/burnmintableerc20.component';
import { ListTokenComponent } from './list-token/list-token.component';
import { PlansTokenComponent } from './plans-token/plans-token.component';
import { Simpleerc20Component } from './simpleerc20/simpleerc20.component';
import { Standarderc20Component } from './standarderc20/standarderc20.component';
import { TokenLockComponent } from './token-lock/token-lock.component';
import { TokenMinterComponent } from './token-minter/token-minter.component';

const routes: Routes = [
  {
    path: '',
    component: ListTokenComponent
  },
  {
    path: 'token-minter',
    component: TokenMinterComponent
  },
  {
    path: 'plans-token',
    component: PlansTokenComponent
  },
  {
    path: 'simpleerc20',
    component: Simpleerc20Component
  },
  {
    path: 'standarderc20',
    component: Standarderc20Component
  },
  {
    path: 'burnmintableerc20',
    component: Burnmintableerc20Component
  },
  {
    path: 'token-lock',
    component: TokenLockComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TokensRoutingModule { }
