import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import TextChoice from "@/lib/translation";
import {PropertyInfoCardText, propertyInfoCardTextChoice} from "@/components/PropertyInfoCard/PropertyInfoCardText";
import {Center} from "@chakra-ui/react";
import {PropertyInfoCard} from "@/components/PropertyInfoCard/PropertyInfoCard";

export default function Home({property, locale}: { property: any, locale: string }) {
    const text: PropertyInfoCardText = propertyInfoCardTextChoice[locale as keyof TextChoice<PropertyInfoCardText>]
    return <Center pt="20px">
        <PropertyInfoCard property={property} text={text}/>
    </Center>
}

export async function getStaticPaths(context: any) {
    const _properties = await prisma.properties.findMany({
        include: {
            projects: {
                include: {
                    developers: {
                        include: {
                            developers_translations: true,
                            cities: {
                                include: {
                                    cities_translations: true,
                                }
                            }
                        }
                    },
                    projects_translations: true
                }
            }
        }
    });

    const needPaths: Array<any> = [];
    context.locales.forEach((l: string) => {
        const localPaths = _properties.map((prop) => {
            return {
                params: {
                    city_slug: prop.projects.developers.cities.slug,
                    property_slug: `${prop.property_type}-in-${prop.projects.slug}-${prop.id}`
                },
                locale: l,
            }
        });
        needPaths.push(...localPaths);
    });

    return {
        paths: needPaths,
        fallback: false, // can also be true or 'blocking'
    }
}

export async function getStaticProps(context: any) {
    const property_id = context.params.property_slug.split('-').at(-1);
    let property = await prisma.properties.findUnique({
        where: {
            id: parseInt(property_id),
        },
        include: {
            projects: {
                include: {
                    developers: {
                        include: {
                            developers_translations: true,
                            cities: {
                                include: {
                                    cities_translations: true,
                                }
                            }
                        }
                    },
                    projects_translations: true
                }
            }
        }
    });

    property = strToFloat(JSON.parse(JSON.stringify(property)));
    return {
        props: {
            property: property,
            locale: context.locale,
        }
    }
}