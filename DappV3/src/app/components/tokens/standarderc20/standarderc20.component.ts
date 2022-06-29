import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-standarderc20',
  templateUrl: './standarderc20.component.html',
  styleUrls: ['./standarderc20.component.scss']
})
export class Standarderc20Component implements OnInit {

  staERC!: FormGroup;

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {
    this.staERC = new FormGroup({
      name:  new FormControl(''),
      Symbol: new FormControl(''),
      decimal: new FormControl(''),
      totalsupply: new FormControl(''),
    });

    this.staERC = this.fb.group({
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
