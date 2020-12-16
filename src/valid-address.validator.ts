import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AddressValidationService } from './address-validation.service';
import { parseString } from 'xml2js';

@Injectable({
  providedIn:'root'
})
export class ValidAddressValidator {

  constructor(private addressService: AddressValidationService) { 
  }

  validAddressValidator(): AsyncValidatorFn {
    return (control:AbstractControl): 
        Promise<{[key: string]: any } | null> |
        Observable<{[key: string]: any } | null> => {        
          let address = {
            address1: control.get('address1').value,
            address2: control.get('address2').value,
            city: control.get('city').value,
            state: control.get('state').value,
            zip : control.get('zip').value,
          };
          return this.addressService.validateAddress(address).pipe(
            map(result => {                                           
              let error = result ? { async: result} : null;
              console.log(error);
              return error;
            })
          );
        }
  }
}