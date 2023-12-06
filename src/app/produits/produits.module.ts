import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { FilterBySelectedPipe } from './filter';



@NgModule({
  declarations: [FilterBySelectedPipe],
  imports: [
    CommonModule,
    NgChartsModule,
    
    

  ]
})
export class ProduitsModule { }
