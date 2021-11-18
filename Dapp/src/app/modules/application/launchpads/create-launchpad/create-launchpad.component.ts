import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/modules/services';

@Component({
  selector: 'app-create-launchpad',
  templateUrl: './create-launchpad.component.html',
  styleUrls: ['./create-launchpad.component.scss']
})
export class CreateLaunchpadComponent implements OnInit {
  model: any = {};
  constructor(public web3Service: Web3Service) { }

  ngOnInit(): void {
  }

  

  onSubmit() {
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.model, null, 4));
  }

}
