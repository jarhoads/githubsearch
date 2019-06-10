import { FormControl } from '@angular/forms';

export class SpecialCharValidator {

    static noSpecialChars() {
        const message = {
            hasSpecialChars: { message: 'No Special Characters Allowed' }
          };

        return (c: FormControl): {[key: string]: any} => {
            const REGEXP = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
            return REGEXP.test(c.value) ? message : null;
        };
    }
}

