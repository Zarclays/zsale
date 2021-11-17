import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaunchpadListComponent } from './launchpad-list/launchpad-list.component';

const routes: Routes = [
  { path: '', component: LaunchpadListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaunchpadsRoutingModule { }
