import { FormControl } from '@angular/forms';

export class SearchFormControl extends FormControl {

    constructor(public label: string, public modelProperty: string, value: any, validator: any) {
        super(value, validator);
    }

    getValidationErrors() {
        const messages: string[] = [];

        if (this.errors) {
          for (const errorName in this.errors) {
            if (!errorName) { messages.push('unknown error'); }
            // tslint:disable-next-line:one-line
            else { messages.push(`Error: ${this.validationMessage(errorName)}`); }
          }
        }
        return messages;
      }

      private validationMessage(errName: string) {
        if (errName === 'hasSpecialChars') { return 'Special Characters Not Allowed'; }
        // tslint:disable-next-line:one-line
        else if (errName === 'required') { return 'Must Enter A Value'; }
        // tslint:disable-next-line:one-line
        else if (errName === 'minlength') { return 'Must Enter Correct Number '; }
        // tslint:disable-next-line:one-line
        else if (errName === 'maxlength') { return 'Must Enter Correct Number '; }
        // tslint:disable-next-line:one-line
        else { return errName; }
      }
}
