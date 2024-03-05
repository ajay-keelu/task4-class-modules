import { Constants } from "./constants/constants";
import { Employee } from "./models/Employees";
import { Role } from "./models/Role";
import { roleServices } from "./services/roleServices";
// getting the role Id
let roleId: string
// getting role
let role: Role;

let roleDescription = document.getElementById('description') as HTMLDivElement | null
let assignedEmployees: Employee[];

// invoking display assigned employees 

class DisplayRoleEmployees {

    //displaying the assigned employees
    public displayRoleAssignedEmployees(data: Employee[]) {
        let innerData: string = "";
        data.forEach(employee => {
            let roleDetailCard = Constants.roleDetailsEmployeeCard;
            roleDetailCard = roleDetailCard.replace('{{firstname}}', employee.firstname).replace('{{lastname}}', employee.lastname).replace('{{image}}', employee.image).replace('{{email}}', employee.email).replace('{{empno}}', employee.empno).replace('{{department}}', employee.department).replace('{{location}}', employee.location);
            innerData += roleDetailCard;
        });
        let employeeProfiles: HTMLDivElement | null = document.querySelector('.role-all-profiles');
        employeeProfiles ? employeeProfiles.innerHTML = innerData : '';
    }

    public getRoleEmployees() {
        roleId = window.location.search.slice(4);
        role = roleServices.getRoleById(roleId);
        assignedEmployees = role ? role.employeesAssigned : [];
        roleDescription ? roleDescription.innerHTML = role ? role.description : "" : "";
        assignedEmployees ? this.displayRoleAssignedEmployees(assignedEmployees) : '';
    }
}
export default DisplayRoleEmployees;