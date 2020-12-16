import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, switchMap, take, tap } from "rxjs/operators";
import { pipe, timer } from "rxjs";
import { parseString } from "xml2js";
import { Address } from "./address.model";

@Injectable({
  providedIn: "root"
})
export class AddressValidationService {
  constructor(private http: HttpClient) {}

  validateAddress(address: Address) {
    let zip4 = "";
    let validationUrl = `
https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=%3CAddressValidateRequest%20USERID=%22964USPSW7756%22%3E%20%3CAddress%3E%3CAddress1%3E${
      address.address1
    }%3C/Address1%3E%3CAddress2%3E${
      address.address2
    }%3C/Address2%3E%20%3CCity%3E${address.city}%3C/City%3E%20%3CState%3E${
      address.state
    }%3C/State%3E%20%3CZip5%3E${
      address.zip
    }%3C/Zip5%3E%20%3CZip4%3E${zip4}%3C/Zip4%3E%20%3C/Address%3E%20%3C/AddressValidateRequest%3E`;

    let debounceTime = 1000;
    return timer(debounceTime).pipe(
      switchMap(() => {
    return this.http.get(validationUrl, { responseType: "text" }).pipe(
      tap(response => console.log(response)),
      map(response => this.getErrorDescription(response)),
      take(1)
    );
      }));
  }

  getErrorDescription(response: string) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(response,"text/xml");
    let error = xmlDoc.getElementsByTagName("Error")[0];    
    let errorDescription = error?.getElementsByTagName("Description")[0].textContent;
    return errorDescription;      
  }
}