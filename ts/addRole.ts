import { Constants } from "./constants/constants";
import { Employee } from "./models/Employees";
import { Role } from "./models/Role";
import DisplayRoleEmployees from "./role";
import { getEmployees } from "./services/employeeServices";
import { generateId, getRoleById, getRoles, setRoles, updateRole } from "./services/roleServices";

var inputEmployeeSearch: HTMLInputElement | null = document.querySelector('.assign-employees input[name="employeeSearch"]');
let employees: Employee[];
var currentRoleDetails: Role;
let searchId: string;
//displaying the searchable data at the assign employees section
function displayEmployeeCard(filterData: Employee[]): void {
    let empData: string = "";
    filterData.forEach((employee) => {
        let employeeCard: string = Constants.EmployeeCardDropdown.replaceAll('{{empId}}', employee.empno).replace('{{image}}', employee.image).replace('{{firstname}}', employee.firstname).replace('{{lastname}}', employee.lastname).replace('{{checked}}', employee.isCheckedRole ? "checked" : "")
        empData += employeeCard
    });
    document.querySelector<HTMLInputElement>(".search-employee-data").innerHTML = empData;
}


let roleRequiredFields: string[] = ["name", "department", "description", "location"]
// resetting the form
function roleResetForm(): void {
    document.querySelector<HTMLFormElement>("#roleForm").reset();
    for (let field of roleRequiredFields) {
        document.querySelector<HTMLSpanElement>(`#${field}`)?.removeAttribute('error')
    }
    employees.forEach((employee) => employee.isCheckedRole = false)
    displayEmployeeRoleBubble()
}

// add role form submission

//on key change getting the employee containing the name
inputEmployeeSearch?.addEventListener("keyup", (e: Event): void => {
    document.querySelector<HTMLLabelElement>(".search-employee-data").style.display = "flex";
    let filterArray: Employee[] = [];
    if ((e.target as HTMLInputElement).value) {
        employees.forEach((employee) => {
            let name = employee.firstname + employee.lastname;
            name.toLowerCase().includes((e.target as HTMLInputElement).value.toLowerCase()) ? filterArray.push(employee) : ""
        });
    }
    displayEmployeeCard(filterArray);
})
inputEmployeeSearch?.addEventListener("blur", (e: Event): void => {
    if (!(e.target as HTMLInputElement).value) {
        document.querySelector<HTMLLabelElement>(".search-employee-data").style.display = "none";
    }
})

//displaying the assigned employees to the role
function displayEmployeeRoleBubble(): void {
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

// displaying the toast message
function toastToggleRole(message: string): void {
    document.querySelector<HTMLDivElement>(".toast").classList.toggle("toast-toggle");
    document.querySelector<HTMLDivElement>(".toast .message").innerText = message;
}

//required fields for the role page
function editRole(id: string): void {
    let roleData: Role = getRoleById(id);
    document.querySelector<HTMLButtonElement>('#addrole') ? document.querySelector<HTMLButtonElement>('#addrole').innerHTML = "Update" : ''
    document.querySelector<HTMLDivElement>('form .title') ? document.querySelector<HTMLDivElement>('form .title').innerHTML = "Edit Role" : ''
    document.querySelector<HTMLInputElement>('input[name="name"]') ? document.querySelector<HTMLInputElement>('input[name="name"]').value = roleData.name : '';
    document.querySelector<HTMLSelectElement>('select[name="department"]') ? document.querySelector<HTMLSelectElement>('select[name="department"]').value = roleData.department : '';
    document.querySelector<HTMLSelectElement>('select[name="location"]') ? document.querySelector<HTMLSelectElement>('select[name="location"]').value = roleData.location : '';
    document.querySelector<HTMLTextAreaElement>('textarea[name="description"]') ? document.querySelector<HTMLTextAreaElement>('textarea[name="description"]').value = roleData.description : '';
    let employeesAssigned: Employee[] = roleData.employeesAssigned;
    employees = getEmployees()
    employees.forEach(employee => {
        employeesAssigned.forEach(emp => {
            employee.empno == emp.empno ? employee.isCheckedRole = true : ""
        })
    })
    currentRoleDetails = { ...roleData }
    displayEmployeeRoleBubble()
}
class AddRoles extends DisplayRoleEmployees {
    public getRoleData(value: string, key: string): void {
        currentRoleDetails[key] = value;
    }
    // adding employees to the role
    public assignEmployeesToRole(empno: string): void {
        employees.forEach((employee) => employee.empno == empno ? employee.isCheckedRole = document.querySelector<HTMLInputElement>(`.employee-card #emp${empno}`).checked : "")
        displayEmployeeRoleBubble();
    }
    // used to remove the employee from the assigned role
    public removeFromEmployeeBubble(empno: string): void {
        let employee: HTMLInputElement | null = document.querySelector(`.employee-card #emp${empno}`);
        employee ? (employee.checked = false) : "";
        employees.forEach((element) => element.empno == empno ? (element.isCheckedRole = false) : "");
        displayEmployeeRoleBubble();
    }
    public getRoleModeAndId() {
        currentRoleDetails = Constants.defaultRoleDetails;
        searchId = window.location.search.slice(4);
        searchId ? editRole(searchId) : employees = getEmployees();
    }
    public addToRole(e: Event) {
        e.preventDefault()
        let isValid: boolean = false;
        roleRequiredFields.forEach((field => {
            let spanElement: HTMLSpanElement | null = document.querySelector(`#${field}`);
            if (!currentRoleDetails[field]) {
                isValid = true;
                spanElement?.setAttribute('error', "")
            } else spanElement?.removeAttribute('error')
        }))
        if (isValid) return;
        currentRoleDetails["employeesAssigned"] = employees.filter(employee => employee.isCheckedRole)
        let roleData: Role = new Role(currentRoleDetails)
        let id: string = !searchId ? generateId() : searchId;
        roleData.id = id;
        let rolesData: Role[] = getRoles();
        searchId ? rolesData = updateRole(rolesData, roleData) : rolesData.push(roleData);
        setRoles(rolesData)
        toastToggleRole(searchId ? "Role Updated Successfully" : "Role Added Successfully");
        currentRoleDetails = Constants.defaultRoleDetails
        setTimeout(() => {
            toastToggleRole("");
            roleResetForm();
            searchId ? window.location.href = "roles.html" : ""
        }, 1500);
    }
}
export default AddRoles