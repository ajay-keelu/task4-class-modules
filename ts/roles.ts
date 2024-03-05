import AddRoles from "./addRole";
import { Constants } from "./constants/constants";
import { filterDropDown } from "./interfaces/interfaces";
import { Role } from "./models/Role";
import { masterService } from "./services/masterService";
import { roleServices } from "./services/roleServices";


let filterDropDown: filterDropDown = { department: '', location: '' }
let hideResetBtns: HTMLDivElement | null = document.querySelector('#hideResetBtns');

//on change select dropdown filter
hideResetBtns ? hideResetBtns.style.display = "none" : '';

class Roles extends AddRoles {

    getSelectOptions(filters: string[], field: string): string {
        let options = '';
        options += `<option value="">${field[0].toUpperCase() + field.substring(1)}</option>`;
        filters.forEach(ele => {
            options += `<option value="${ele}">${ele}</option>`;
        })
        return options;
    }

    // displaying the all the roles
    public displayRoles(roles: Role[]): void {
        let innerData: string = ""
        roles.forEach((role: Role) => {
            let roleCardData: string = Constants.roleCard;
            let imageDivision: string = `<div class="top"><img src="{{employeeImage}}" height="20px" alt="profile" /></div>`;
            let imageCardContainer: string = role.employeesAssigned?.length > 4 ? `<div class="top"> +${role.employeesAssigned.length - 4}</div>` : "";
            imageCardContainer += role.employeesAssigned.splice(0, 4).map(employee => imageDivision.replace('{{employeeImage}}', employee.image));
            roleCardData = roleCardData.replaceAll("{{roleId}}", role.id).replace("{{roleName}}", role.name).replace("{{roleLocation}}", role.location).replace("{{roleDepartment}}", role.department).replace('{{roleCardImageContainer}}', imageCardContainer);
            innerData += roleCardData;
        });
        let roleCards: HTMLDivElement | null = document.querySelector('.roles-items');
        roleCards ? roleCards.innerHTML = roles.length > 0 ? innerData : '<div class="noDataFound">No data found</div>' : '';
        this.getRoleModeAndId();
    }

    public loadDropdownFilters() {
        document.querySelector<HTMLSelectElement>('select.roles-location') ? document.querySelector<HTMLSelectElement>('select.roles-location').innerHTML = this.getSelectOptions(masterService.getRoleLocations(), "location") : "";
        document.querySelector<HTMLSelectElement>('select.roles-department') ? document.querySelector<HTMLSelectElement>('select.roles-department').innerHTML = this.getSelectOptions(masterService.getRoleDepartments(), "department") : "";
    }

    public filterChange(value: string, key: string): void {
        filterDropDown[key] = value;
        let flag = false;
        for (let key in filterDropDown) {
            if (filterDropDown[key]) flag = true;
        }
        flag ? hideResetBtns.style.display = "block" : hideResetBtns.style.display = "none";
    }

    // on click edit in cards in page redirect to add role page and edit
    public redirectingToEditRole(id: string): void {
        window.location.href = `addRoles.html?id=${id}`;
    }

    // redirecting to roles details page by clicking view-all-employees to see assigned employees
    public redirectToEmployees(id: string): void {
        window.location.href = 'rolesDetails.html?id=' + id;
    }

}

let roleObj = new Roles();

// on clicking apply filter will be applied
document.querySelector<HTMLButtonElement>('.right-item .apply')?.addEventListener('click', (e: Event): void => {
    e.preventDefault();
    let filteredData: Role[] = [];
    roleServices.getRoles().forEach((role) => {
        let flag: boolean = true;
        for (let key in filterDropDown) {
            if (filterDropDown[key] && role[key] != filterDropDown[key]) flag = false;
        }
        flag ? filteredData.push(role) : "";
    });
    roleObj.displayRoles(filteredData);
})

// on clicking reset displaying the all the roles
roleObj.loadDropdownFilters();
document.querySelector<HTMLButtonElement>('.right-item .reset')?.addEventListener('click', (): void => roleObj.displayRoles(roleServices.getRoles()));
export default Roles;