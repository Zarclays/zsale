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
    component: ListTokenComponent,
    data: {
      title: 'List'
    }
  },
  {
    path: 'token-minter',
    component: TokenMinterComponent,
    data: {
      title: 'Mint Token'
    }
  },
  {
    path: 'plans-token',
    component: PlansTokenComponent,
    data: {
      title: 'Token Plans'
    }
  },
  {
    path: 'simpleerc20',
    component: Simpleerc20Component,
    data: {
      title: 'Simple ERC20'
    }
  },
  {
    path: 'standarderc20',
    component: Standarderc20Component,
    data: {
      title: 'Standard ERC20'
    }
  },
  {
    path: 'burnmintableerc20',
    component: Burnmintableerc20Component,
    data: {
      title: 'Burn Mintable ERC20'
    }
  },
  {
    path: 'token-lock',
    component: TokenLockComponent,
    data: {
      title: 'Token Lock'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TokensRoutingModule { }
