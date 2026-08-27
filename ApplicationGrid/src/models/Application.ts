export interface Application {
    id: string;
    applicationNumber: string;
    name: string;
    applicationType: string;
    status: string;
    customer: string;
    submittedDate?: Date;
    expiryDate?: Date;
}
