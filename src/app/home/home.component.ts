import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tiles: Tile[] = [
    {text: 'Two', cols: 2, rows: 8, color: 'lightgreen'},
    {text: 'One', cols: 8, rows: 8, color: 'lightblue'},
    {text: 'five', cols: 2, rows: 8, color: 'lightgreen'},
  ];

  constructor() { }

  ngOnInit(): void {
  }


}
