import { Employee } from "../models/Employees";

export class EmployeeService {
    getEmployees(): Employee[] {
        return JSON.parse(localStorage.getItem("EmployeeData")) || [];
    }

    setEmployees(employees: Employee[]): void {
        localStorage.setItem("EmployeeData", JSON.stringify(employees));
    }

    getById(id: string): Employee {
        return this.getEmployees().find((employee: Employee) => employee.empno == id);
    }

    deleteById(id: string): void {
        this.setEmployees(this.getEmployees().filter(employee => employee.empno != id));
    }

    update(employee: Employee): void {
        let employees: Employee[] = this.getEmployees();
        let index: number = employees.findIndex(ele => ele.empno == employee.empno);
        employees[index] = employee;
        this.setEmployees(employees);
    }
    create(employee: Employee): void {
        let employees: Employee[] = this.getEmployees();
        employees.push(employee);
        this.setEmployees(employees);
    }
    save(employee: Employee): void {
        let emp = this.getById(employee.empno);
        emp ? this.update(employee) : this.create(employee);
    }
}

export let employeeServices = new EmployeeService();