import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-launchpad-detail',
  templateUrl: './launchpad-detail.component.html',
  styleUrls: ['./launchpad-detail.component.scss']
})
export class LaunchpadDetailComponent implements OnInit {
  // @ts-ignore
  id: number ;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // @ts-ignore
      this.id = +params.get('id');


    })
  }
}
