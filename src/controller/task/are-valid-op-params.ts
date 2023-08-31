export function areValidOpParams(account: any, id: any, timeString: any): boolean {
    return (typeof account === "string")
        && (typeof id === "string")
        && (typeof timeString === "string")
        && !isNaN(Date.parse(timeString));
}