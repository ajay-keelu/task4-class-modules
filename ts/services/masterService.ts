import { Employee } from "../models/Employees";
import { Role } from "../models/Role";

class MasterService {
    getEmployees(): Employee[] {
        return JSON.parse(localStorage.getItem('EmployeeData')) || [];
    }
    getRoles(): Role[] {
        return JSON.parse(localStorage.getItem("RolesData")) || [];
    }
    getStatus(employees: Employee[]): string[] {
        let status = new Set<string>()
        employees.forEach(employee => {
            status.add(employee.status == 1 ? 'Active' : 'In Active')
        })
        return [...status];
    }
    getLocations(employees: Employee[]): string[] {
        let locations = new Set<string>();
        employees.forEach(employee => {
            locations.add(employee.location);
        })
        return [...locations];
    }
    getDepartments(employees: Employee[]): string[] {
        let departments = new Set<string>();
        employees.forEach(employee => {
            departments.add(employee.department);
        })
        return [...departments];
    }
    getRoleLocations(): string[] {
        let locations = new Set<string>();
        this.getRoles().forEach(role => {
            locations.add(role.location);
        })
        return [...locations];
    }

    getRoleDepartments(): string[] {
        let departments = new Set<string>();
        this.getRoles().forEach(role => {
            departments.add(role.department);
        })
        return [...departments];
    }
}

export let masterService = new MasterService();