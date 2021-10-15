import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  token: any;
  tokenAddress!: any;
  totalSupply:any;

  filteredOptions: any;
  formGroup!: FormGroup;
  options: any = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.tokenAddress = this.route.snapshot.paramMap.get('address');
    console.log('this.tokenAddress', this.tokenAddress);

    this.searchSymbolByToken(this.tokenAddress);
    this.getTotalSupply(this.tokenAddress);

    this.initForm();
  }

  initForm() {
    this.formGroup = this.fb.group({
      'employee': ['']
    })
    this.formGroup.get('employee')!.valueChanges.subscribe(response => {
      console.log('data is ', response);
      if (response.length >= 3) {
        this.generalService.searchCoin(response)
          .subscribe(response => {
            console.log('--response', response);

            this.options = response;
            this.filteredOptions = response;
            this.filterData(response);
          }, err => {
            console.log(err);
          })
      }
    })
  }

  selectCoin(item: any) {
    console.log('address', item.link);
    this.tokenAddress = item.link;
    this.searchSymbolByToken(this.tokenAddress);
    this.getTotalSupply(this.tokenAddress);
  }


  filterData(enteredData: any) {
    this.filteredOptions = this.options.filter((item: any) => {
      return item.name.toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  searchSymbolByToken(tokenAddress: any) {
    this.generalService.searchSymbolByToken(this.tokenAddress)
      .subscribe(response => {
        console.log('--response', response);
        this.token = response[0];
      }, err => {
        console.log(err);
      })
  }

  getTotalSupply(tokenAddress: any) {
    this.generalService.getTotalSupply(tokenAddress)
      .subscribe(response => {
        console.log('--response getTotalSupply', response);
        this.totalSupply = response.result;
      }, err => {
        console.log(err);
      })
  }

  




}
