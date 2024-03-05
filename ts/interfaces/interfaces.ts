import { employeeStatus } from "../enums/enums";

interface selectedFilters {
    alphabet: string,
    status: employeeStatus,
    location: string,
    department: string
}

interface filterDropDown {
    department: string,
    location: string
}

export { selectedFilters, filterDropDown }