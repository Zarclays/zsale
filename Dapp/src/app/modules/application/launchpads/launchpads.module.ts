import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LaunchpadsRoutingModule } from './launchpads-routing.module';

import { LaunchpadListComponent } from './launchpad-list/launchpad-list.component';
import { ServicesModule } from '../../../modules/services/services.module';
import { LaunchpadDetailComponent } from './launchpad-detail/launchpad-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateLaunchpadComponent } from './create-launchpad/create-launchpad.component';

import {MatStepperModule} from '@angular/material/stepper';

import {MatInputModule} from '@angular/material/input';

import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';

import {
  NgxMatDateFormats,
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
  NGX_MAT_DATE_FORMATS
} from '@angular-material-components/datetime-picker';

// const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
//   parse: {
//     dateInput: "l, LTS"
//   },
//   display: {
//     dateInput: "l, LTS",
//     monthYearLabel: "MMM YYYY",
//     dateA11yLabel: "LL",
//     monthYearA11yLabel: "MMMM YYYY"
//   }
// };

import {MatButtonModule} from '@angular/material/button';

import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    
    LaunchpadListComponent,
         LaunchpadDetailComponent,
         CreateLaunchpadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule ,
    LaunchpadsRoutingModule,
    ServicesModule,
    MatStepperModule,
    MatCheckboxModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDateModule ,
     NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,

    MatButtonModule,
    MatProgressBarModule,
    MatListModule,
    MatCardModule
  ],
  exports:[
    LaunchpadListComponent
  ],
  providers:[
    // {
    //   provide: STEPPER_GLOBAL_OPTIONS,
    //   useValue: { showError: true }
    // }
    // { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class LaunchpadsModule { }
