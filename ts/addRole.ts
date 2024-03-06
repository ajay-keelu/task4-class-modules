import { Constants } from "./constants/constants";
import { Employee } from "./models/Employees";
import { Role } from "./models/Role";
import DisplayRoleEmployees from "./role";
import { employeeServices } from "./services/employeeServices";
import { roleServices } from "./services/roleServices";

let employees: Employee[];
var currentRoleDetails: Role;
let searchId: string;


// resetting the form

class AddRoles extends DisplayRoleEmployees {


    roleResetForm(): void {
        document.querySelector<HTMLFormElement>("#roleForm").reset();
        for (let field of Constants.RoleRequiredFields) {
            document.querySelector<HTMLSpanElement>(`#${field}`)?.removeAttribute('error')
        }
        employees.forEach((employee) => employee.isCheckedRole = false)
        this.displayEmployeeRoleBubble()
    }
    //required fields for the role page
    editRole(id: string): void {
        let roleData: Role = roleServices.getById(id);
        document.querySelector<HTMLButtonElement>('#addrole') ? document.querySelector<HTMLButtonElement>('#addrole').innerHTML = "Update" : ''
        document.querySelector<HTMLDivElement>('form .title') ? document.querySelector<HTMLDivElement>('form .title').innerHTML = "Edit Role" : ''
        document.querySelector<HTMLInputElement>('input[name="name"]') ? document.querySelector<HTMLInputElement>('input[name="name"]').value = roleData.name : '';
        document.querySelector<HTMLSelectElement>('select[name="department"]') ? document.querySelector<HTMLSelectElement>('select[name="department"]').value = roleData.department : '';
        document.querySelector<HTMLSelectElement>('select[name="location"]') ? document.querySelector<HTMLSelectElement>('select[name="location"]').value = roleData.location : '';
        document.querySelector<HTMLTextAreaElement>('textarea[name="description"]') ? document.querySelector<HTMLTextAreaElement>('textarea[name="description"]').value = roleData.description : '';
        let employeesAssigned: Employee[] = roleData.employeesAssigned;
        employees = employeeServices.getAll()
        employees.forEach(employee => {
            employeesAssigned.forEach(emp => {
                employee.empno == emp.empno ? employee.isCheckedRole = true : ""
            })
        })
        currentRoleDetails = { ...roleData }
        this.displayEmployeeRoleBubble()
    }

    //displaying the assigned employees to the role
    displayEmployeeRoleBubble(): void {
        var inputEmployeeSearch: HTMLInputElement | null = document.querySelector('.assign-employees input[name="employeeSearch"]');
        let employeeBubble: HTMLDivElement | null = document.querySelector(".employee-bubble");
        let innerData: string = ""
        let flag: boolean = true;
        employees.forEach((employee) => {
            if (employee.isCheckedRole) {
                flag = false;
                let bubbleCard = Constants.EmployeeBubble
                bubbleCard = bubbleCard.replace('{{empId}}', employee.empno).replace('{{firstname}}', employee.firstname).replace('{{image}}', employee.image)
                innerData += bubbleCard;
            }
        });
        employeeBubble ? employeeBubble.innerHTML = innerData : ''
        employeeBubble ? employeeBubble.style.display = flag ? "none" : "flex" : '';
        inputEmployeeSearch ? inputEmployeeSearch.style.maxWidth = flag ? "100%" : "calc(100% - 147px)" : '';
        employeeBubble ? employeeBubble.style.width = flag ? "0" : "147px" : '';
    }

    hideEmployeeSearch(e: Event) {
        if (!(e.target as HTMLInputElement).value) {
            document.querySelector<HTMLLabelElement>(".search-employee-data").style.display = "none";
        }
    }

    //on key change getting the employee containing the name
    searchEmployees(e: Event) {
        document.querySelector<HTMLLabelElement>(".search-employee-data").style.display = "flex";
        let filterArray: Employee[] = [];
        if ((e.target as HTMLInputElement).value) {
            employees.forEach((employee) => {
                let name = employee.firstname + employee.lastname;
                name.toLowerCase().includes((e.target as HTMLInputElement).value.toLowerCase()) ? filterArray.push(employee) : ""
            });
        }
        this.displayEmployeeCard(filterArray);
    }
    //displaying the searchable data at the assign employees section
    displayEmployeeCard(filterData: Employee[]): void {
        let empData: string = "";
        filterData.forEach((employee) => {
            let employeeCard: string = Constants.EmployeeCardDropdown.replaceAll('{{empId}}', employee.empno).replace('{{image}}', employee.image).replace('{{firstname}}', employee.firstname).replace('{{lastname}}', employee.lastname).replace('{{checked}}', employee.isCheckedRole ? "checked" : "")
            empData += employeeCard
        });
        document.querySelector<HTMLInputElement>(".search-employee-data").innerHTML = empData;
    }

    // displaying the toast message
    toastToggleRole(message: string): void {
        document.querySelector<HTMLDivElement>(".toast").classList.toggle("toast-toggle");
        document.querySelector<HTMLDivElement>(".toast .message").innerText = message;
    }

    getRoleData(value: string, key: string): void {
        currentRoleDetails[key] = value;
    }

    // adding employees to the role
    assignEmployeesToRole(empno: string): void {
        employees.forEach((employee) => employee.empno == empno ? employee.isCheckedRole = document.querySelector<HTMLInputElement>(`.employee-card #emp${empno}`).checked : "")
        this.displayEmployeeRoleBubble();
    }

    // used to remove the employee from the assigned role
    removeFromEmployeeBubble(empno: string): void {
        let employee: HTMLInputElement | null = document.querySelector(`.employee-card #emp${empno}`);
        employee ? (employee.checked = false) : "";
        employees.forEach((element) => element.empno == empno ? (element.isCheckedRole = false) : "");
        this.displayEmployeeRoleBubble();
    }

    getRoleParams() {
        currentRoleDetails = Constants.DefaultRoleDetails;
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        searchId = urlParams.get('id') as string;
        searchId ? this.editRole(searchId) : employees = employeeServices.getAll();
    }

    validateForm(currentRoleDetails: Role): boolean {
        let isValid = true;
        for (let field of Constants.RoleRequiredFields) {
            if (!currentRoleDetails[field]) {
                document.querySelector<HTMLSpanElement>(`span#${field}`)?.setAttribute('error', '');
                isValid = false;
            }
        }
        return isValid;
    }
    generateRole(currentRoleDetails: Role) {
        roleServices.save(currentRoleDetails);
    }
    addToRole(e: Event) {
        e.preventDefault();
        if (this.validateForm(currentRoleDetails)) {
            currentRoleDetails.employeesAssigned = employees.filter(employee => employee.isCheckedRole)
            this.generateRole(currentRoleDetails);
            this.toastToggleRole(searchId ? "Role Updated Successfully" : "Role Added Successfully");
            currentRoleDetails = Constants.DefaultRoleDetails
            setTimeout(() => {
                this.toastToggleRole("");
                this.roleResetForm();
                searchId ? window.location.href = "roles.html" : ""
            }, 1500);
        }
    }

}
export default AddRoles;