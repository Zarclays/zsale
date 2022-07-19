import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocsRoutingModule } from './docs-routing.module';
import { TokenMintDocsComponent } from './token-mint-docs/token-mint-docs.component';
import { DocsHomeComponent } from './docs-home/docs-home.component';


@NgModule({
  declarations: [
    TokenMintDocsComponent,
    DocsHomeComponent
  ],
  imports: [
    CommonModule,
    DocsRoutingModule
  ]
})
export class DocsModule { }
