import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SearchFormControl } from './search-form-control';
import { SpecialCharValidator } from './special-char-validator';

export class SearchFormGroup extends FormGroup {
    constructor(keys: string[]) {

        const controls = {};

        keys.forEach((key) => {
            const validators = [];

            if (key === 'q') {
                validators.push(Validators.required);
            }
            if (key === 'stars') {
                validators.push(Validators.minLength(2), Validators.maxLength(4));
            }

            validators.push(SpecialCharValidator.noSpecialChars());
            controls[key] = new SearchFormControl(`${key}`, `${key}`, '', Validators.compose(validators));
        });

        super(controls);
    }

    get searchControls(): SearchFormControl[] {
        return Object.keys(this.controls)
                     .map(key => this.controls[key] as SearchFormControl);
    }

    getFormErrorMessages(form: any): string[] {
        const messages: string[] = [];
        this.searchControls.forEach(control => control.getValidationErrors()
                                                      .forEach(message => messages.push(message)));
        return messages;
    }

}
