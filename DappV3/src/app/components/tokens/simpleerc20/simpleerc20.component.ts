import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-simpleerc20',
  templateUrl: './simpleerc20.component.html',
  styleUrls: ['./simpleerc20.component.scss']
})
export class Simpleerc20Component  {

  constructor(private fb: FormBuilder) {

  }

  simERC!: FormGroup;

  ngOnInit() {
    this.simERC = new FormGroup({
      name:  new FormControl(''),
      Symbol: new FormControl(''),
      decimal: new FormControl(''),
      totalsupply: new FormControl(''),
    });

    this.simERC = this.fb.group({
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
