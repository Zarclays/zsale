import { Component, OnInit } from '@angular/core';
import { Simpleerc20Component } from '../simpleerc20/simpleerc20.component';
import { Standarderc20Component } from '../standarderc20/standarderc20.component';
import { Burnmintableerc20Component } from '../burnmintableerc20/burnmintableerc20.component';
import { FormControl } from '@angular/forms';



@Component({
  selector: 'app-list-token',
  templateUrl: './list-token.component.html',
  styleUrls: ['./list-token.component.scss']
})
export class ListTokenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

