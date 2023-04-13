export function getPropertiesFromCity(city: any){
    const devs = city.developers;
    const projects : Array<any>  = [];
    devs.forEach((dev: any) => {
        projects.push(...dev.projects);
    })

    const properties: Array<any> = [];
    projects.forEach((proj: any) => {
        properties.push(...proj.properties);
    });

    return properties;
}