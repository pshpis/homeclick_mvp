import {cities} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import TextChoice from "@/lib/translation";
import {Center, Heading, VStack} from "@chakra-ui/react";
import React from "react";
import {strToFloat} from "@/lib/validation";
import {PropertiesList} from "@/components/PropertiesList/PropertiesList";

interface WaterfrontText {
    title: string,
}

const waterfrontTextChoise: TextChoice<WaterfrontText> = {
    en: {
        title: "The best waterfront properties from "
    },
    ru: {
        title: "Лучшие объекты на берегу моря в ",
    }
}
export default function Home({city, properties, locale}: any) {
    const translation = city.cities_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];
    const text = waterfrontTextChoise[locale as keyof TextChoice<WaterfrontText>];

    return <Center as={VStack}>
        <Heading p="20px 0">
            {text.title + " " + translation.name_in}
        </Heading>
        <PropertiesList properties={properties} locale={locale} city_slug={city.slug}/>
    </Center>
}

export async function getStaticPaths(context: any) {
    const _cities: cities[] = await prisma.cities.findMany();
    const needPaths: Array<any> = [];
    context.locales.forEach((l: string) => {
        const localPaths = _cities.map((c) => {
            return {
                params: {
                    city_slug: c.slug,
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
    const city_slug = context.params.city_slug;
    let city = await prisma.cities.findUnique({
        where: {
            slug: city_slug,
        },
        include: {
            cities_translations: true,
        }
    });
    city = strToFloat(JSON.parse(JSON.stringify(city)));
    let properties = await prisma.properties.findMany({
        include: {
            projects: {
                include: {
                    projects_translations: true,
                    developers: {
                        include: {
                            developers_translations: true,
                            cities: {
                                include: {
                                    cities_translations: true,
                                }
                            }
                        }
                    }
                }
            },
            properties_translations: true,
        }
    });
    properties = strToFloat(JSON.parse(JSON.stringify(properties)));
    properties = properties.filter((p: any) => {
        return p.projects.developers.cities.slug === city_slug && p.projects.has_waterfront;
    });

    return {
        props: {
            city: city,
            properties: properties,
            locale: context.locale,
        }
    }
}