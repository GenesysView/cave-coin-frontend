import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeviewComponent } from './tradeview.component';

describe('TradeviewComponent', () => {
  let component: TradeviewComponent;
  let fixture: ComponentFixture<TradeviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TradeviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
