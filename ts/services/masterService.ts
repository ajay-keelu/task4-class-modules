import { Employee } from "../models/Employees";
import { Role } from "../models/Role";

class MasterService {
    getEmployees(): Employee[] {
        return JSON.parse(localStorage.getItem('employeeData')) || [];
    }
    getRoles(): Role[] {
        return JSON.parse(localStorage.getItem("RolesData")) || [];
    }
    getStatus(): string[] {
        let status = new Set<string>()
        this.getEmployees().forEach(employee => {
            status.add(employee.status == 1 ? 'Active' : 'In Active')
        })
        return [...status];
    }
    getLocations(): string[] {
        let locations = new Set<string>();
        this.getEmployees().forEach(employee => {
            locations.add(employee.location);
        })
        return [...locations];
    }
    getDepartments(): string[] {
        let departments = new Set<string>();
        this.getEmployees().forEach(employee => {
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