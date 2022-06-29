import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-burnmintableerc20',
  templateUrl: './burnmintableerc20.component.html',
  styleUrls: ['./burnmintableerc20.component.scss']
})
export class Burnmintableerc20Component implements OnInit {

  burnERC!: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.burnERC = new FormGroup({
      name:  new FormControl(''),
      Symbol: new FormControl(''),
      decimal: new FormControl(''),
      totalsupply: new FormControl(''),
    });

    this.burnERC = this.fb.group({
      name: ['', Validators.required],
      symbol: ['', Validators.required],
      decimal: ['', Validators.required],
      totalsupply: ['', Validators.required],
    })
  }

  onSubmit(form: FormGroup) {
    console.log('Token Name: ', form.value.name);
    console.log('Token Symbol: ', form.value.symbol);

  }

}
