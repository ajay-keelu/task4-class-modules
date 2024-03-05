import { Employee } from "../models/Employees";

function getEmployees(): Employee[] {
    return JSON.parse(localStorage.getItem("EmployeeData")) || [];
}

function setEmployees(employees: Employee[]): void {
    localStorage.setItem("EmployeeData", JSON.stringify(employees));
}

function getById(id: string): Employee {
    return getEmployees().find((employee: Employee) => employee.empno == id);
}

function deleteById(id: string): void {
    setEmployees(getEmployees().filter(employee => employee.empno != id))
}

function update(employee: Employee): void {
    let employees: Employee[] = getEmployees()
    let index: number = employees.findIndex(ele => ele.empno == employee.empno)
    employees[index] = employee;
    setEmployees(employees)
}

function create(employee: Employee): void {
    let employees: Employee[] = getEmployees()
    employees.push(employee)
    setEmployees(employees)
}

function save(employee: Employee): void {
    let emp = getById(employee.empno)
    emp ? update(employee) : create(employee)
}


function getLocations(): string[] {
    let locations = new Set<string>()
    getEmployees().forEach(employee => {
        locations.add(employee.location)
    })
    return [...locations] as string[]
}

function getDepartments(): string[] {
    let departments = new Set<string>()
    getEmployees().forEach(employee => {
        departments.add(employee.department)
    })
    return [...departments] as string[]
}

export { getEmployees, getById, getLocations, getDepartments, save, deleteById }
