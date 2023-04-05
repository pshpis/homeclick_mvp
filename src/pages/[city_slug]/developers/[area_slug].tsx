import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import {DevelopersList} from "@/components/DevelopersList/DevelopersList";
import {Center, Heading} from "@chakra-ui/react";
import React from "react";
import {DevelopersListText, developersTextChoice} from "@/components/DevelopersList/DevelopersListText";
import TextChoice from "@/lib/translation";

export default function Home({locale, city, area}: any) {
    const translation = city.cities_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];

    const text: DevelopersListText = developersTextChoice[locale as keyof TextChoice<DevelopersListText>];
    let developers: Array<any> = [];
    area.projects.forEach((p: any) => {
        if (developers.findIndex((dev) => {
            return dev.id === p.developers.id
        }) === -1) {
            developers.push(p.developers);
        }
    });


    return <>
        <Center>
            <Heading p="20px 0">
                {text.title + " " + translation.name_in}
            </Heading>
        </Center>
        <DevelopersList developers={developers} locale={locale}></DevelopersList>
    </>
}

export async function getStaticPaths(context: any) {
    const _cities = await prisma.cities.findMany({
        include: {
            areas: true,
        }
    });
    const needPaths: Array<any> = [];
    context.locales.forEach((l: string) => {
        const localPaths: Array<any> = [];
        _cities.forEach((c) => {
            c.areas.forEach(a => {
                localPaths.push({
                    params: {
                        city_slug: c.slug,
                        area_slug: 'in-' + a.slug,
                    },
                    locale: l,
                });
            })

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
            developers: {
                include: {
                    developers_translations: true,
                    cities: true,
                    projects: {
                        include: {
                            areas: true,
                        }
                    }
                }
            },
            areas: true,
            metro_stations: true,
            malls: true,
        }
    });
    city = strToFloat(JSON.parse(JSON.stringify(city)));

    const area_full_slag = context.params.area_slug as string;
    const area_slug = area_full_slag.slice(3);

    let area = await prisma.areas.findUnique({
        where: {
            slug: area_slug,
        },
        include: {
            areas_translations: true,
            projects: {
                include: {
                    developers: {
                        include: {
                            developers_translations: true,
                            cities: true,
                        }
                    }
                }
            }
        }
    });

    area = strToFloat(JSON.parse(JSON.stringify(area)));
    return {
        props: {
            locale: context.locale,
            city: city,
            area: area
        }
    }
}