export function strToFloat(obj: any){
    let keys: Array<any> = [];
    try {
        keys = Object.keys(obj);
    }
    catch (e) {
        console.log(e)
    }

    keys.forEach(key => {
        if (typeof obj[key] == "string" && !isNaN(parseFloat(obj[key]))) {
            obj[key] = parseFloat(obj[key]);
            return;
        }
        if (Array.isArray(obj[key])){
            obj[key] = obj[key].map((o: any) => {
                return strToFloat(o);
            });
            return;
        }
        if (typeof obj[key] == "object"){
            obj[key] = strToFloat(obj[key]);
            return;
        }
    })
    return obj;
}