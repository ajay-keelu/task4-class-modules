import { Constants } from "./constants/constants";
import { Employee } from "./models/Employees";
import Roles from "./roles";
import { deleteById, getById, save } from "./services/employeeServices";
import { validateForm } from "./services/formValidation";

let empId: string, mode: string;
var employeeFormDetails: Employee = Constants.defaultEmployeeDetails

//on submitting data form reset
function resetForm(): void {
    mode == "edit" ? window.location.reload() : "";
    document.querySelector<HTMLFormElement>("#employeeForm").reset();
    document.querySelector<HTMLImageElement>(".left-wrapper .img-wrapper img").src = employeeFormDetails.image;
    for (let field of requiredFields) {
        let spanElement: HTMLSpanElement | null = document.querySelector(`span[name="${field}"]`);
        spanElement ? spanElement.removeAttribute('error') : "";
    }
}

// form submit
let requiredFields: string[] = ["empno", "email", "firstname", "lastname", "joiningDate"];
document.querySelector<HTMLButtonElement>(".form-add-employee")?.addEventListener("click", (e: Event) => {
    e.preventDefault();
    let isValid: boolean = false;
    for (let field of requiredFields) {
        let ele = document.querySelector<HTMLSpanElement>('span#' + field);
        !employeeFormDetails[field] ? ele.setAttribute('error', '') : ele.removeAttribute('error');
        if (!employeeFormDetails[field])
            isValid = true
    }
    if (isValid) return
    isValid = validateForm(employeeFormDetails, mode)
    if (!isValid) return
    employeeFormDetails["empno"] = `${parseInt(employeeFormDetails.empno)}`;
    let employee: Employee = new Employee(employeeFormDetails);
    save(employee)
    employeeFormDetails = Constants.defaultEmployeeDetails
    toastToggle(mode != "edit" ? "Employee Added Successfully" : "Updated Successfully");
    setTimeout(() => {
        toastToggle("");
        resetForm();
        mode == "edit" ? (window.location.href = 'employee.html?id=' + empId + '&&mode=view') : ""
    }, 1500);
});

// enabling the toast message on submitting the form
function toastToggle(message: string): void {
    document.querySelector<HTMLDivElement>(".toast").classList.toggle("toast-toggle");
    document.querySelector<HTMLDivElement>(".toast .message").innerText = message;
}

//displayDataIntoInput
function displayDataIntoInput(employee: Employee, mode: string): void {
    document.querySelector<HTMLImageElement>(".left-wrapper .img-wrapper img").src = employee.image
    document.querySelector<HTMLLabelElement>(`label[for="file"]`).style.display = mode == 'Edit' ? '' : "none";
    document.querySelector<HTMLImageElement>(`label[for="file"] img`).src = mode == 'Edit' ? "../assests/images/file-pen.svg" : "none";
    document.querySelector<HTMLDivElement>(".employee-details > .title").innerText = mode + " Employee";
    for (let key in employee)
        key != "status" && key != "image" ? (document.getElementsByName(`${key == 'role' ? 'jobTitle' : key}`)[0] as HTMLInputElement).value = employee[key] : ""
}

class AddEmployee extends Roles {
    //getting mode and employee id if it exists
    public getModeandId(): void {
        let URL: string = window.location.search.slice(1);
        [empId, mode] = URL ? URL.split('&&') : ["", ""];
        empId = empId ? empId.slice(3) : "";
        mode = mode ? mode.slice(5) : "";
        ((mode == "view" || mode == "edit") && !empId) ? window.location.href = "index.html" : ""
        mode == "view" && empId ? this.viewPage(empId) : mode == "edit" && empId ? this.editPage(empId) : ""
    }
    // redirecting view page to edit page
    public editEmployee(event: Event, id: string): void {
        event.preventDefault()
        window.location.href = 'employee.html?id=' + id + '&&mode=edit'
    }

    //deleting the employee
    public deleteEmployeeUsingId(event: Event, id: string): void {
        event.preventDefault()
        deleteById(id)
        window.location.href = 'index.html'
    }

    //reading the image file
    public getImage(imagedata: HTMLInputElement): void {
        let reader: FileReader = new FileReader();
        reader.readAsDataURL(imagedata.files[0]);
        reader.onload = () => {
            (document.querySelector(".left-wrapper .img-wrapper img") as HTMLImageElement).src = reader.result as string;
            employeeFormDetails.image = reader.result as string;
        };
        reader.onerror = () => alert("Please upload the image again!");
    };

    // view the employee in add employee page
    public viewPage(id: string): void {
        let viewEmployee: Employee = getById(id);
        !viewEmployee ? window.location.href = "index.html" : '';
        document.querySelector<HTMLDivElement>("#editOrDelete").innerHTML += `<button class="edit" onclick="window.app.editEmployee(event,${id})">Edit</button>  <button class="delete" onclick = "window.app.deleteEmployeeUsingId(event,${id})" > Delete</button> `
        displayDataIntoInput(viewEmployee, 'View')
        Array.from(document.querySelector<HTMLFormElement>('#employeeForm').elements).forEach((ele: HTMLInputElement) => ele.disabled = true)
        document.querySelector<HTMLDivElement>(".employment-information .btn-wrapper").style.display = "none";
    }

    // on form input changes invoking the function
    public onFormInputChange(value: string, name: string): void {
        employeeFormDetails[name] = value.trim();
    }

    // edit/ update the employee data
    public editPage(id: string): void {
        let editEmployee: Employee = getById(id);
        !editEmployee ? window.location.href = "index.html" : "";
        employeeFormDetails = editEmployee;
        document.querySelector<HTMLButtonElement>(".employment-information .btn-wrapper .add-employee button").innerHTML = 'Update'
        displayDataIntoInput(editEmployee, "Edit");
        (document.querySelector<HTMLInputElement>(`input[name="empno"]`)).disabled = true;
    }
}
export default AddEmployee 