import { Employee } from "../models/Employees";

export class EmployeeService {
    getAll(): Employee[] {
        return (JSON.parse(localStorage.getItem("EmployeeData")) || []).map(emp => new Employee(emp));
    }

    set(employees: Employee[]): void {
        localStorage.setItem("EmployeeData", JSON.stringify(employees));
    }

    getById(id: string): Employee {
        return this.getAll().find((employee: Employee) => employee.empno == id);
    }

    delete(id: string): void {
        this.set(this.getAll().filter(employee => employee.empno != id));
    }

    update(employee: Employee): void {
        let employees: Employee[] = this.getAll();
        let index: number = employees.findIndex(ele => ele.empno == employee.empno);
        employees[index] = employee;
        this.set(employees);
    }

    create(employee: Employee): void {
        let employees: Employee[] = this.getAll();
        employees.push(employee);
        this.set(employees);
    }

    save(employee: Employee): void {
        let emp = this.getById(employee.empno);
        emp ? this.update(employee) : this.create(employee);
    }
}

export let employeeServices = new EmployeeService();