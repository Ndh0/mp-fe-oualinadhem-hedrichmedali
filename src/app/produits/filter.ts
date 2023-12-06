// filter-by-selected.pipe.ts

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBySelected'
})
export class FilterBySelectedPipe implements PipeTransform {
  transform(items: any[], selectedFilter: string): any[] {
    if (!items || !selectedFilter || selectedFilter === 'all') {
      return items;
    }

    if (selectedFilter === 'zero') {
      return items.filter(item => item.totD === 0);
    } else if (selectedFilter === 'nonZero') {
      return items.filter(item => item.totD !== 0);
    } else {
      return items;
    }
  }
}
