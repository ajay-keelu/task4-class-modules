import { EmployeeStatus } from "../enums/enums";

interface EmployeeSelectedFilters {
    alphabet: string,
    status: EmployeeStatus,
    location: string,
    department: string
}

interface RoleSelectedFilters {
    department: string,
    location: string
}

export { EmployeeSelectedFilters, RoleSelectedFilters }