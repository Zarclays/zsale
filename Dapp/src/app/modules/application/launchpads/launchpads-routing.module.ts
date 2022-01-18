import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaunchpadListComponent } from './launchpad-list/launchpad-list.component';
import { LaunchpadDetailComponent } from './launchpad-detail/launchpad-detail.component';
import { CreateLaunchpadComponent } from './create-launchpad/create-launchpad.component';

const routes: Routes = [
  { path: '', component: LaunchpadListComponent },
  { path: 'list', component: LaunchpadListComponent },
  { path: 'create', component: CreateLaunchpadComponent },
  { path: ':id', component: LaunchpadDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaunchpadsRoutingModule { }
