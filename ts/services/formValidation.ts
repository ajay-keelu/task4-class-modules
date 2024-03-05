import { Employee } from "../models/Employees";
import { employeeServices } from "./employeeServices";
export class Utility {
    //validate the email
    isValidEmail(email: string) {
        let pattern: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        let spanElement: HTMLElement | null = document.querySelector(`span#email`);
        if (!pattern.test(email)) {
            this.appendError(spanElement, '<b class="exclamation"><b>!</b></b> please enter valid email address')

            return false;
        }
        spanElement ? spanElement.removeAttribute('error') : "";

        return true;
    }

    // vallidate first name
    isValidFirstName(name: string): boolean {
        let spanElement: HTMLElement | null = document.querySelector(`span#firstname`);
        if (!name || name.length <= 3) {
            this.appendError(spanElement, '<b class="exclamation"><b>!</b></b> length should be greater then three')

            return false;
        }
        spanElement ? spanElement.removeAttribute('error') : "";

        return true;
    }

    //validating the empno
    isValidEmployeeNumber(empno: string): boolean {
        let spanElement: HTMLElement | null = document.querySelector(`span#empno`);
        empno = `${parseInt(empno)}`
        let employee: Employee = employeeServices.getById(empno);
        if (employee) {
            this.appendError(spanElement, '<b class="exclamation"><b>!</b></b> employee number already exists')

            return false;
        }
        spanElement ? spanElement.removeAttribute('error') : "";

        return true;
    }

    validateForm(employee: Employee): boolean {
        let employee_1: Employee = employeeServices.getById(employee.empno);
        if (employee_1)
            return this.isValidEmail(employee.email) && this.isValidFirstName(employee.firstname);
        else
            return this.isValidEmail(employee.email) && this.isValidFirstName(employee.firstname) && this.isValidEmployeeNumber(employee.empno);

    }

    appendError(element: HTMLSpanElement, message: string) {
        element.innerHTML = message;
        element.setAttribute('error', '')
    }
}
export let utility = new Utility();