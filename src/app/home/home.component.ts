import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import Web3 from 'web3';


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

  currentAccount = null;

  filteredOptions: any;
  formGroup!: FormGroup;
  options: any = [];

  tiles: Tile[] = [
    { text: 'Two', cols: 2, rows: 8, color: 'lightgreen' },
    { text: 'One', cols: 8, rows: 8, color: 'lightblue' },
    { text: 'five', cols: 2, rows: 8, color: 'lightgreen' },
  ];

  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formGroup = this.fb.group({
      'employee': ['']
    })
    this.formGroup.get('employee')!.valueChanges.subscribe(response => {
      console.log('data is ', response);
      if(response.length>=3){
        this.generalService.searchCoin(response)
        .subscribe(response => {
            console.log('--response',response);
            
            this.options = response;
            this.filteredOptions = response;
            this.filterData(response);
          }, err => {
            console.log(err);
          })
      }
    })
  }


  filterData(enteredData: any) {
    this.filteredOptions = this.options.filter((item: any) => {
      console.log('item', item);

      return item.name.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }


  selectCoin(item: any) {
    console.log('address', item.link);
    this.router.navigate(['detail/' + item.link]);
  }

}
