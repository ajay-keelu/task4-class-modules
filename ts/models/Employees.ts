import { employeeStatus } from "../enums/enums";

export class Employee {
    image: string;
    firstname: string;
    lastname: string;
    email: string;
    empno: string;
    location: string;
    mobile: string;
    dob: string;
    department: string;
    status: employeeStatus;
    jobTitle: string;
    joiningDate: string;
    assignManager: string;
    assignProject: string;
    isCheckedRole?: boolean;
    isDelete?: boolean;
    constructor(employee: Employee) {
        Object.assign(this, employee);
    }
}