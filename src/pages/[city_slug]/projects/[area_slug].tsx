import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import {Center, Heading, VStack} from "@chakra-ui/react";
import React from "react";
import TextChoice from "@/lib/translation";
import {ProjectsText, projectsTextChoice} from "@/pages/[city_slug]/projects/index";
import {ProjectsList} from "@/components/ProjectsList/ProjectsList";

export default function Home({area, locale, city}: any) {
    const translation = area.areas_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];

    const text = projectsTextChoice[locale as keyof TextChoice<ProjectsText>];

    return <>
        <Center as={VStack}>
            <Heading p="20px 0">
                {text.title + " " + translation.name + " area"}
            </Heading>
            <ProjectsList locale={locale} city_slug={city.slug} projects={area.projects}/>
        </Center>
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
                            projects_translations: true,
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
                    projects_translations: true,
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