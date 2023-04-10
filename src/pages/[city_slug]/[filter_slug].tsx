import {cities} from "@prisma/client";
import {prisma} from "@/lib/prisma";

export default function Home({slug}: any){
    return <>{slug}</>
}

function getPropertiesFromCity(city: any){
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

export async function getStaticPaths(context: any) {
    const _cities: cities[] = await prisma.cities.findMany({
        include: {
            developers: {
                include: {
                    projects: {
                        include: {
                            properties: {
                                include: {
                                    projects: {
                                        include: {
                                            areas: true
                                        }
                                    }
                                }
                            },
                        }
                    }
                }
            }
        }
    });

    const needPaths: Array<any> = [];
    context.locales.forEach((l: string) => {
        _cities.forEach((city) => {
            const properties = getPropertiesFromCity(city);
            properties.forEach((property: any) => {
                const filter_slug =
                    `${property.room_type}-${property.property_type}s-for-sale-in-${property.projects.areas.slug}`;
                needPaths.push({
                    locale: l,
                    params: {
                        city_slug: city.slug,
                        filter_slug: filter_slug,
                    }
                });
            });
        });
    });

    return {
        paths: needPaths,
        fallback: false, // can also be true or 'blocking'
    }
}

export async function getStaticProps(context: any) {
    return {
        props:{
            slug: context.params.filter_slug,
        }
    }
}