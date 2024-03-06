import { Constants } from "./constants/constants";
import { Employee } from "./models/Employees";
import Roles from "./roles";
import { employeeServices } from "./services/employeeServices";
import { utility } from "./services/formValidation";
let empId: string, mode: string;
var employeeFormDetails: Employee = Constants.DefaultEmployeeDetails;

class AddEmployee extends Roles {

    //getting mode and employee id if it exists
    getEmployeeParams(): void {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        mode = urlParams.get('mode') as string;
        empId = urlParams.get('id') as string
        ((mode == "view" || mode == "edit") && !empId) ? window.location.href = "index.html" : "";
        mode == "view" && empId ? this.viewPage(empId) : mode == "edit" && empId ? this.editPage(empId) : "";
    }

    // redirecting view page to edit page
    editEmployee(event: Event, id: string): void {
        event.preventDefault();
        window.location.href = 'employee.html?id=' + id + '&&mode=edit';
    }

    //deleting the employee
    deleteEmployeeUsingId(event: Event, id: string): void {
        event.preventDefault();
        employeeServices.delete(id);
        window.location.href = 'index.html';
    }

    //reading the image file
    getImage(imagedata: HTMLInputElement): void {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(imagedata.files[0]);
        reader.onload = () => {
            (document.querySelector(".left-wrapper .img-wrapper img") as HTMLImageElement).src = reader.result as string;
            employeeFormDetails.image = reader.result as string;
        };
        reader.onerror = () => alert("Please upload the image again!");
    };

    // view the employee in add employee page
    viewPage(id: string): void {
        let viewEmployee: Employee = employeeServices.getById(id);
        !viewEmployee ? window.location.href = "index.html" : '';
        document.querySelector<HTMLDivElement>("#editOrDelete").innerHTML += `<button class="edit" onclick="window.app.editEmployee(event,${id})">Edit</button>  <button class="delete" onclick = "window.app.deleteEmployeeUsingId(event,${id})" > Delete</button>`;
        this.displayDataIntoInput(viewEmployee, 'View');
        Array.from(document.querySelector<HTMLFormElement>('#employeeForm').elements).forEach((ele: HTMLInputElement) => ele.disabled = true);
        document.querySelector<HTMLDivElement>(".employment-information .btn-wrapper").style.display = "none";
    }

    // on form input changes invoking the function
    onFormInputChange(value: string, name: string): void {
        employeeFormDetails[name] = value.trim();
    }

    //displayDataIntoInput
    displayDataIntoInput(employee: Employee, mode: string): void {
        document.querySelector<HTMLImageElement>(".left-wrapper .img-wrapper img").src = employee.image;
        document.querySelector<HTMLLabelElement>(`label[for="file"]`).style.display = mode == 'Edit' ? '' : "none";
        document.querySelector<HTMLImageElement>(`label[for="file"] img`).src = mode == 'Edit' ? "../assests/images/file-pen.svg" : "none";
        document.querySelector<HTMLDivElement>(".employee-details > .title").innerText = mode + " Employee";
        for (let key in employee)
            key != "status" && key != "image" ? (document.getElementsByName(`${key == 'role' ? 'jobTitle' : key}`)[0] as HTMLInputElement).value = employee[key] : "";
    }

    // edit/ update the employee data
    editPage(id: string): void {
        let editEmployee: Employee = employeeServices.getById(id);
        !editEmployee ? window.location.href = "index.html" : "";
        employeeFormDetails = editEmployee;
        document.querySelector<HTMLButtonElement>(".employment-information .btn-wrapper .add-employee button").innerHTML = 'Update';
        this.displayDataIntoInput(editEmployee, "Edit");
        (document.querySelector<HTMLInputElement>(`input[name="empno"]`)).disabled = true;
    }

    //on submitting data form reset
    resetForm(): void {
        mode == "edit" ? window.location.reload() : "";
        document.querySelector<HTMLFormElement>("#employeeForm").reset();
        document.querySelector<HTMLImageElement>(".left-wrapper .img-wrapper img").src = employeeFormDetails.image;
        for (let field of Constants.EmployeeRequiredFields) {
            let spanElement: HTMLSpanElement | null = document.querySelector(`span[name="${field}"]`);
            spanElement ? spanElement.removeAttribute('error') : "";
        }
    }

    // enabling the toast message on submitting the form
    toastToggle(message: string): void {
        document.querySelector<HTMLDivElement>(".toast").classList.toggle("toast-toggle");
        document.querySelector<HTMLDivElement>(".toast .message").innerText = message;
    }
    // form submit
    handleSubmit(e: Event) {
        e.preventDefault();
        let isValid: boolean = false;
        for (let field of Constants.EmployeeRequiredFields) {
            let ele = document.querySelector<HTMLSpanElement>('span#' + field);
            !employeeFormDetails[field] ? ele.setAttribute('error', '') : ele.removeAttribute('error');
            if (!employeeFormDetails[field])
                isValid = true;
        }
        if (isValid) return;

        isValid = utility.validateForm(employeeFormDetails);

        if (!isValid) return;

        employeeFormDetails.empno = `${parseInt(employeeFormDetails.empno)}`;

        let employee: Employee = new Employee(employeeFormDetails);
        employeeServices.save(employee);
        employeeFormDetails = Constants.DefaultEmployeeDetails;
        this.toastToggle(mode != "edit" ? "Employee Added Successfully" : "Updated Successfully");
        setTimeout(() => {
            this.toastToggle("");
            this.resetForm();
            mode == "edit" ? (window.location.href = 'employee.html?id=' + empId + '&&mode=view') : ""
        }, 1500);
    }
}
export default AddEmployee;