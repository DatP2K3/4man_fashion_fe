import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBy',
})
export class FilterByPipe implements PipeTransform {
  transform<T>(items: T[] | null, property: string[], value: any): T[] {
    if (!items) {
      return [];
    }

    return items.filter((item) => {
      const itemValue = this.getPropertyValue(item, property);
      return itemValue === value;
    });
  }

  private getPropertyValue(obj: any, path: string[]): any {
    if (path.length === 1) {
      return obj[path[0]];
    }

    return path.reduce(
      (o, key) => (o && o[key] !== undefined ? o[key] : undefined),
      obj
    );
  }
}
