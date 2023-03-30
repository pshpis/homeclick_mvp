export function strToFloat(obj: any){
    Object.keys(obj).forEach(key => {
        if (isNaN(parseFloat(obj[key]))) {
            return;
        }
        obj[key] = parseFloat(obj[key]);
    })
    return obj;
}