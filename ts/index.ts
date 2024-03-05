import { Constants } from "./constants/constants";
import { Employee } from "./models/Employees";
import { getDepartments, getEmployees, getLocations } from "./services/employeeServices";
import AddEmployee from "./addEmployee";
import { getRoles } from "./services/roleServices";

export enum employeeStatus {
    '' = 0,
    'active' = 1,
    'in active' = 2,
}

export interface selectedFilters {
    alphabet: string,
    status: employeeStatus,
    location: string,
    department: string
}

let selectedFilters: selectedFilters = Constants.selectedFilters
let employees: Employee[] = [];
let prevPopUpBtn: HTMLDivElement | null;
let prevSortBtn: HTMLImageElement | null;

function getStatus(): string[] {
    let status = new Set<string>()
    employees.forEach(employee => {
        status.add(employee.status == 1 ? 'Active' : 'In Active')
    })
    return [...status]
}

function dropdownFilers(filterData: Employee[]): Employee[] {
    let filteredData: Employee[] = [];
    filterData.forEach(employee => {
        let flag = true;
        for (let key in selectedFilters) {
            if (key != 'alphabet' && selectedFilters[key] && employee[key] != selectedFilters[key]) flag = false;
        }
        flag ? filteredData.push(employee) : ""
    })
    return filteredData
}

function setAlphbetFilters(id: string): void {
    let filterBtnEle = document.getElementById(id) as HTMLDivElement | null;
    let filterbtns = "";
    for (let i = 65; i <= 90; i++)
        filterbtns += `<button id="btn${String.fromCharCode(i + 32)}" onclick=window.app.onFilterAlphabet('${String.fromCharCode(i + 32)}')>${String.fromCharCode(i)}</button>`;
    filterBtnEle ? filterBtnEle.innerHTML += filterbtns : "";
}

function getOptions(filters: string[], field: string): string {
    let options = '';
    if (field == 'status') {
        options += `<option value="0">Status</option>`
        filters.forEach(ele => {
            options += `<option value="${employeeStatus[ele.toLocaleLowerCase()]}">${ele}</option>`
        })
    }
    else {
        options += `<option value="">${field[0].toUpperCase() + field.substring(1)}</option>`
        filters.forEach(ele => {
            options += `<option value="${ele}">${ele}</option>`
        })
    }
    return options;
}

class App extends AddEmployee {

    public employeeDropdownFilter(value: string, key: string): void {
        selectedFilters[key] = value;
        let flag = false;
        for (let key in selectedFilters)
            if (key != 'alphabet' && key != 'status' && selectedFilters[key].length > 0) flag = true;
        !flag ? selectedFilters['status'] != 0 ? flag = true : "" : ''
        flag ? document.querySelector<HTMLDivElement>('#hideResetBtns').style.display = "block" : document.querySelector<HTMLDivElement>('#hideResetBtns').style.display = "none"
    }

    public getFilteredEmployeesbyAlphabet(): Employee[] {
        let alphabetFilteredEmps: Employee[] = selectedFilters.alphabet ? employees.filter((employee) => (employee.firstname ? employee.firstname : employee.lastname).toLowerCase().startsWith(selectedFilters.alphabet)) : employees;
        return dropdownFilers(alphabetFilteredEmps);
    }

    public displayFilteredEmployees(): void {
        let filteredEmps: Employee[] = this.getFilteredEmployeesbyAlphabet();
        let empTable: string = Constants.Employeetableheader;
        filteredEmps.forEach(employee => {
            let row: string = Constants.EmployeeRow;
            empTable += row.replaceAll('{{employeeNumber}}', employee.empno).replace('{{firstname}}', employee.firstname).replace('{{lastname}}', employee.lastname).replace('{{image}}', employee.image).replace('{{email}}', employee.email).replace('{{location}}', employee.location)
                .replace('{{department}}', employee.department).replace('{{role}}', employee.jobTitle).replace('{{status}}', employeeStatus[employee.status])
                .replace('{{joiningDate}}', employee.joiningDate);
        });
        let tableElement: HTMLTableElement | null = document.querySelector("#employeeTableData");
        tableElement ? (tableElement.innerHTML = (filteredEmps.length > 0 ? empTable : `<td colspan="9" style="text-align:center; padding:10px 0px">No data found</td>`)) : ""
    }

    public removeDropdownFilter(): void {
        selectedFilters = {
            alphabet: selectedFilters.alphabet,
            status: 0,
            location: '',
            department: ''
        }
        this.employeeDropdownFilter("", "status")
        this.displayFilteredEmployees();
    }

    public exportDataToCSV(): void {
        let exportData: Employee[] = this.getFilteredEmployeesbyAlphabet();
        let csvFile: string = "S.No, User, Location, Departmant, Role, Employee ID, Status, Join Dt \n";
        exportData.forEach((employee, i) => csvFile += `${i + 1},${employee.firstname + " " + employee.lastname}, ${employee.location}, ${employee.department},${employee.jobTitle},${employee.empno},${employeeStatus[employee.status]},${employee.joiningDate}\n`);
        document.body.innerHTML = (`<a style="display:none" href="data:text/csv;charset=utf-8,${encodeURI(csvFile)}" download="employees.csv"></a>`) + document.body.innerHTML
        document.links[0].click();
    }

    public deleteEmployeesUsingCheckbox(): void {
        let tableCheckbox: NodeListOf<HTMLInputElement> = document.querySelectorAll("input.table-checkbox")
        let selectedEmpIds: string[] = Array.from(tableCheckbox).filter(ele => ele.checked).map((element) => element.id);
        employees = employees.filter(employee => !selectedEmpIds.includes(employee.empno))
        this.displayFilteredEmployees();
    }

    public popUpDisplay(e: HTMLDivElement): void {
        e = e.parentNode as HTMLDivElement;
        if (prevPopUpBtn && prevPopUpBtn == e) {
            prevPopUpBtn.classList.toggle("view-toggle"); return;
        }
        e.classList.add("view-toggle");
        prevPopUpBtn = e;
    }

    public hidePopUp(): void {
        if (prevPopUpBtn && prevPopUpBtn.classList.contains("view-toggle")) prevPopUpBtn.classList.remove("view-toggle");
    }

    public sortData(key: string, order: string, selector: string): void {
        prevSortBtn ? prevSortBtn.style.background = "" : ""
        let sortedData: Employee[] = employees.sort(function (emp1: Employee, emp2: Employee): number {
            let employee1: string | number, employee2: string | number;
            employee1 = (key == "name" ? `${emp1.firstname} ${emp1.lastname}`.toLocaleLowerCase() : key == 'empno' ? parseInt(emp1[key]) : (`${emp1[key]}`).toLowerCase());
            employee2 = (key == "name" ? `${emp2.firstname} ${emp2.lastname}`.toLocaleLowerCase() : key == 'empno' ? parseInt(emp2[key]) : (`${emp2[key]}`).toLowerCase());
            if (order != "desc")
                return employee1 > employee2 ? 1 : -1;

            return employee1 > employee2 ? -1 : 1;
        });
        employees = sortedData;
        this.displayFilteredEmployees();
        let currentEle: HTMLImageElement | null = document.querySelector(selector)
        currentEle ? currentEle.style.background = "rgb(251, 192, 192)" : "";
        prevSortBtn = currentEle
    }

    public deleteEmployee(id: string): void {
        employees.forEach(employee => (employee.empno == id ? employee.status = 2 : ''))
        this.loadSelectDropdown()
    }

    public viewOrEditEmployee(empId: string, mode: string): void {
        window.location.href = `employee.html?id=${empId}&&mode=${mode}`;
    }

    public employeeCheckBox(e: HTMLInputElement) {
        let tableCheckbox: NodeListOf<HTMLInputElement> = document.querySelectorAll("input.table-checkbox");
        e && tableCheckbox?.forEach((element: HTMLInputElement) => e ? element.checked = e.checked : "")
        let flag: boolean = false;
        tableCheckbox.forEach((data) => data.checked ? (flag = true) : "");
        flag ? document.getElementById("deleteBtn").removeAttribute("disabled") : document.getElementById("deleteBtn")?.setAttribute("disabled", "true");
        flag = true
        tableCheckbox.forEach(data => !data.checked ? flag = false : "")
        tableCheckbox.length ? document.querySelector<HTMLInputElement>(".table-check-box input").checked = flag : ""
    }

    public onFilterAlphabet(alphabet: string): void {
        let filterBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('#filterBtns button')
        filterBtns.forEach(ele => {
            if (ele.classList.contains('active')) ele.classList.remove('active')
            if (ele.id == 'btn' + alphabet)
                ele.classList.add('active')
        })
        selectedFilters.alphabet = alphabet;
        this.displayFilteredEmployees()
    }

    public sideBarToggle(): void {
        document.querySelector(".sidebar").classList.toggle("sidebar-toggle")
    }

    public removeAlphabetFilter(): void {
        selectedFilters = {
            alphabet: '',
            status: 0,
            location: '',
            department: ''
        }
        this.employeeDropdownFilter("", "status")
        this.displayFilteredEmployees();
        let filterBtns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('#filterBtns button')
        filterBtns.forEach(ele => {
            if (ele.classList.contains('active')) ele.classList.remove('active')
        })
        let dropDownFilterForm: HTMLFormElement | null = document.querySelector('#dropdownFilterForm')
        dropDownFilterForm ? dropDownFilterForm.reset() : ''
    }

    public loadEmployees(): void {
        employees = getEmployees()
    }

    public loadSelectDropdown() {
        document.querySelectorAll<HTMLSelectElement>('.select-item.status')[1] ? document.querySelectorAll<HTMLSelectElement>('.status')[1].innerHTML = getOptions(getStatus(), 'status') : ''
        document.querySelectorAll<HTMLSelectElement>('.select-item.location')[1] ? document.querySelectorAll<HTMLSelectElement>('.location')[1].innerHTML = getOptions(getLocations(), 'location') : ''
        document.querySelectorAll<HTMLSelectElement>('.select-item.department')[1] ? document.querySelectorAll<HTMLSelectElement>('.department')[1].innerHTML = getOptions(getDepartments(), 'department') : ''
        document.querySelectorAll<HTMLSelectElement>('.select-item.status')[1] ? document.querySelectorAll<HTMLSelectElement>('.status')[1].value = `${selectedFilters.status}` : '';
        document.querySelectorAll<HTMLSelectElement>('.select-item.location')[1] ? document.querySelectorAll<HTMLSelectElement>('.location')[1].value = selectedFilters.location : '';
        document.querySelectorAll<HTMLSelectElement>('.select-item.department')[1] ? document.querySelectorAll<HTMLSelectElement>('.department')[1].value = selectedFilters.department : '';
        this.displayFilteredEmployees()
    }

    public loadSelectMobileDropdown() {
        document.querySelectorAll('.select-item.status')[0] ? document.querySelectorAll('.status')[0].innerHTML = getOptions(getStatus(), 'status') : '';
        document.querySelectorAll('.select-item.location')[0] ? document.querySelectorAll('.location')[0].innerHTML = getOptions(getLocations(), 'location') : ''
        document.querySelectorAll('.select-item.department')[0] ? document.querySelectorAll('.department')[0].innerHTML = getOptions(getDepartments(), 'department') : ''
    }

    public loadFilters(): void {
        setAlphbetFilters("filterBtns");
        setAlphbetFilters("buttonsWrapper");
    }

    public initilalise(): void {
        this.loadEmployees()
        this.loadSelectDropdown()
        this.loadSelectMobileDropdown()
        this.loadFilters()
        this.getModeandId()
        this.getRoleEmployees()
        this.displayRoles(getRoles())
        let hideResetBtns: HTMLDivElement | null = document.querySelector('#hideResetBtns');
        hideResetBtns ? hideResetBtns.style.display = "none" : ''
    }
}
const app = new App();
(window as any).app = app;
window.onload = () => app.initilalise();