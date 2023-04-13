import {cities} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import {PropertiesList} from "@/components/PropertiesList/PropertiesList";
import {getPropertiesFromCity} from "@/lib/nestedRequests";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import TextChoice from "@/lib/translation";
import {Center, Heading} from "@chakra-ui/react";

enum PageType{
    Static,
    Dynamic
}

interface FilterPageText{
    headerText: string;
}

const filterPageTextChoice: TextChoice<FilterPageText> = {
    en: {
        headerText: 'Properties by your filter',
    },
    ru: {
        headerText: 'Объекты по вашему запросу'
    }

}

export default function Home(props: any){
    const router = useRouter();
    const {locale} = props;

    const [properties, setProperties] = useState([]);

    useEffect(() => {
        if (props.type === PageType.Dynamic){
            const min_price = router.query.minPrice;
            const max_price = router.query.maxPrice;
            if (min_price === undefined || max_price === undefined) return;
            axios.get(`/api/getPropertiesByFilter?city_slug=${props.city.slug}&property_type=${props.property_type}&min_price=${min_price}&max_price=${max_price}`)
            .then((response: any) => {
                console.log(`/api/getPropertiesByFilter?city_slug=${props.city.slug}&property_type=${props.property_type}&min_price=${min_price}&max_price=${max_price}`);
                console.log(response);
                setProperties(response.data);
            });
        }
    }, [router, props.city.slug, props.property_type, props.type]);

    if (props.type === PageType.Static){
        return <>
            <Heading as={Center} p="20px">
                {filterPageTextChoice[locale as keyof TextChoice<FilterPageText>].headerText}
            </Heading>
            <PropertiesList properties={props.properties} city_slug={props.city.slug} locale={locale}/>
        </>
    }

    return <>
        <Heading as={Center} p="20px">
            {filterPageTextChoice[locale as keyof TextChoice<FilterPageText>].headerText}
        </Heading>
        <PropertiesList properties={properties} city_slug={props.city.slug} locale={locale}/>
    </>;


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
            const property_types: Array<any> = [];
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
                if (property_types.indexOf(property.property_type) === -1)
                    property_types.push(property.property_type)
            });
            property_types.forEach((tp: any) => {
                needPaths.push({
                    locale: l,
                    params: {
                        city_slug: city.slug,
                        filter_slug: tp + 's',
                    }
                });
            })
        });
    });

    return {
        paths: needPaths,
        fallback: false, // can also be true or 'blocking'
    }
}

export async function getStaticProps(context: any) {
    const city_slug = context.params.city_slug;
    let city = await prisma.cities.findUnique({
        where: {
            slug: city_slug,
        },
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
                                    },
                                    properties_translations: true,
                                }
                            },
                        }
                    }
                }
            }
        }
    });

    city = strToFloat(JSON.parse(JSON.stringify(city)));

    let properties = getPropertiesFromCity(city);

    if (context.params.filter_slug.indexOf('for-sale') === -1){
        return {
            props: {
                type: PageType.Dynamic,
                property_type: context.params.filter_slug.slice(0, -1),
                city: city,
                locale: context.locale,
            }
        }
    }
    const splited_filter = context.params.filter_slug.split('-');
    const room_type = splited_filter[0];
    const property_type: string = splited_filter[1].slice(0, -1);
    let area_slug: string = '';
    for (let i = splited_filter.indexOf('in') + 1; i < splited_filter.length; i ++){
        area_slug += splited_filter[i] + '-';
    }
    if (area_slug.at(-1) === '-') area_slug = area_slug.slice(0, -1);

    properties = properties.filter((prop: any) => {
        return prop.room_type === parseFloat(room_type) && prop.property_type === property_type && prop.projects.areas.slug === area_slug;
    });

    properties = strToFloat(JSON.parse(JSON.stringify(properties)));

    return {
        props:{
            type: PageType.Static,
            slug: context.params.filter_slug,
            properties: properties,
            city: city,
            room_type,
            property_type,
            area_slug,
            locale: context.locale,
        }
    }
}