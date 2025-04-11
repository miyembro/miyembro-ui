import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hasAddress' })
export class HasAddressPipe implements PipeTransform {
  transform(address: any): boolean {
    
    if (!address) return false;
    return Object.values(address).some(value => value != null);
  }
}