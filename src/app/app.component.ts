import { Component, VERSION } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { AddressValidationService } from '../address-validation.service';
import { ValidAddressValidator } from '../valid-address.validator';

const validationMessages = {
  required:'This field is required',
  email: 'Email should be in proper format (name@domain.com)',
  minLength: (error: any) => `Field can be no less than ${error.minLength} characters`,
  maxLength: (error: any) => `Field can be no more than ${error.minLength.requiredLength} characters`,
  address: 'Address should be complete.',
  async: undefined
}
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  hasBasicFormSubmissionAttempted: boolean = false;
  hasAddressFormSubmissionAttempted: boolean = false;
  validationMessages = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    async: ''
  };
  constructor(private fb: FormBuilder, private addressValidation: AddressValidationService, private validAddressValidator: ValidAddressValidator) {}
  name = 'Angular ' + VERSION.major;  

  basicForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.minLength(4), Validators.email]],
  });
  
  addressForm = this.fb.group({
      address1: ['', [Validators.required, Validators.maxLength(50)]],
      address2: ['', Validators.maxLength(50)],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      zip: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
    }, { validators: addressValidator})

  asyncForm = this.fb.group({
      address1: ['', [Validators.required, Validators.maxLength(50)]],
      address2: ['', Validators.maxLength(50)],
      city: ['', [Validators.required, Validators.maxLength(50)]],
      state: ['', [Validators.required, Validators.maxLength(2)]],
      zip: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
    }, { 
      validators: addressValidator,  
      asyncValidators: this.validAddressValidator.validAddressValidator()      
      });

  ngOnInit() {    
    this.basicForm.valueChanges.pipe(
      debounceTime(1000),
      filter(f => this.basicForm.dirty)
    )
    .subscribe(_ => this.setMessage(this.basicForm, ''));

    this.addressForm.valueChanges.pipe(
      debounceTime(1000),
      filter(f => this.basicForm.dirty)
    )
    .subscribe(_ => this.setMessage(this.addressForm, 'address'));

    this.asyncForm.statusChanges.pipe(      
    )
    .subscribe(vc => { this.setMessage(this.asyncForm, 'async');});    

  }

  setMessage(form: FormGroup, validationKey: string): void {
    let controlNames = Object.keys(form.controls)    
    controlNames.forEach(c => {      
      let control = form.get(c);      
      this.validationMessages[c] = '';
      if (control) {
        // if ((this.hasBasicFormSubmissionAttempted || control.touched || control.dirty) && control.errors) 
        if ((control.touched || control.dirty) && control.errors) {     
          this.validationMessages[c] = Object.keys(control.errors).map(key => validationMessages[key] ? validationMessages[key] : control.errors[key]).join(' ');    
        };
      }
    });
    this.validationMessages[validationKey] = '';    
    if (form.errors) {
      console.log('errors found');
      this.validationMessages[validationKey] = Object.keys(form.errors).map(key => validationMessages[key] ? validationMessages[key] : form.errors[key]).join(' ');    
    }
    else {
      console.log('no errors found');
    }

  }
  onSubmit() {
    let controlNames = Object.keys(this.basicForm.controls);
    this.hasBasicFormSubmissionAttempted = true;
    this.setMessage(this.basicForm, '');        
  }

  onSubmitCrossField() {    
    this.hasAddressFormSubmissionAttempted = true;
    this.setMessage(this.addressForm, 'address');        
  }

  onSubmitAsync() {
    this.hasAddressFormSubmissionAttempted = true;
    this.setMessage(this.asyncForm, 'async');    
    
  }
}

  export function addressValidator(control: AbstractControl): {[key: string]: boolean} | null {
  const address1 = control.get('address1');
  const address2 = control.get('address2');
  const city = control.get('city');
  const state = control.get('state');
  const zip = control.get('zip');  
return address1?.errors || address2?.errors || city?.errors || state?.errors || zip?.errors ? { address: true } : null;
};
