import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaunchpadsRoutingModule } from './launchpads-routing.module';

import { LaunchpadListComponent } from './launchpad-list/launchpad-list.component';
import { ServicesModule } from '../../../modules/services/services.module';

@NgModule({
  declarations: [
    
    LaunchpadListComponent
  ],
  imports: [
    CommonModule,
    LaunchpadsRoutingModule,
    ServicesModule
  ],
  exports:[
    LaunchpadListComponent
  ]
})
export class LaunchpadsModule { }
