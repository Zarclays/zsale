import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsHomeComponent } from './docs-home/docs-home.component';
import { TokenMintDocsComponent } from './token-mint-docs/token-mint-docs.component';

const routes: Routes = [
  {
    path: '',
    component: DocsHomeComponent,
    data: {
      title: 'Documentations'
    }
  },
  {
    path: 'token-mint-docs',
    component: TokenMintDocsComponent,
    data: {
      title: 'Token Minter Documention'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
