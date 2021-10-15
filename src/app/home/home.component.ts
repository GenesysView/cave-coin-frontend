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

  intervalSlide = 5000;
  proportionSlide = 25;
  numSlide= 5;
  slides = [
    {'image': 'https://revistabyte.es/wp-content/uploads/2019/10/que-son-las-criptomonedas-e-invertir-en-criptomonedas-696x461.jpg'}, 
    {'image': 'https://s.france24.com/media/display/cc347944-0a9a-11eb-b90d-005056bf87d6/w:1280/p:16x9/Bitcoin.webp'},
    {'image': 'https://fotografias.antena3.com/clipping/cmsimages01/2021/03/02/0CABE1F1-B6D6-4C7E-920E-AFEC2E4E4B57/98.jpg?crop=750,422,x0,y40&width=1900&height=1069&optimize=low&format=webply'}, 
    {'image': 'https://cdn.euroinnova.edu.es/img/subidasEditor/funciones%20-%202021-04-22t090510-1619075140.876'}, 
    {'image': 'https://ichef.bbci.co.uk/news/640/cpsprodpb/5ECC/production/_118086242_gettyimages-1312494054.jpg'}
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
