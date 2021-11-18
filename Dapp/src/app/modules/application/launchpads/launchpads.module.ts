import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaunchpadsRoutingModule } from './launchpads-routing.module';

import { LaunchpadListComponent } from './launchpad-list/launchpad-list.component';
import { ServicesModule } from '../../../modules/services/services.module';
import { LaunchpadDetailComponent } from './launchpad-detail/launchpad-detail.component';
import { FormsModule} from '@angular/forms';
import { CreateLaunchpadComponent } from './create-launchpad/create-launchpad.component';

// import {MatStepperModule} from '@angular/material/stepper';

// import {MatInputModule} from '@angular/material/input';

// import {MatButtonModule} from '@angular/material/button';

// import {MatListModule} from '@angular/material/list';

@NgModule({
  declarations: [
    
    LaunchpadListComponent,
         LaunchpadDetailComponent,
         CreateLaunchpadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LaunchpadsRoutingModule,
    ServicesModule,
    //     MatStepperModule,

    // MatInputModule,

    // MatButtonModule,

    // MatListModule
  ],
  exports:[
    LaunchpadListComponent
  ]
})
export class LaunchpadsModule { }
