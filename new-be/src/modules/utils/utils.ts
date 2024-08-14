export enum GeneralStatus { 
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    
}

export function phoneRegex(phone: string): boolean {
    const regExp = /^\+?[1-9]\d{1,14}$/;
    return regExp.test(phone);
}

export const  regexPhone = /^\+?[1-9]\d{1,14}$/;