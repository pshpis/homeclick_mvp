import {cities} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import TextChoice from "@/lib/translation";
import {Center, Heading} from "@chakra-ui/react";
import React from "react";
import {ProjectsList} from "@/components/ProjectsList/ProjectsList";

export interface ProjectsText {
    title: string,
}

export const projectsTextChoice: TextChoice<ProjectsText> = {
    ru: {
        title: 'Проекты в '
    },
    en: {
        title: 'Project in '
    }
}

export default function Home({city, locale}: { city: any, locale: string }) {
    const translation = city.cities_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];
    const text = projectsTextChoice[locale as keyof TextChoice<ProjectsText>];
    const projects: Array<any> = [];
    city.developers.forEach((dev: any) => {
        projects.push(...dev.projects);
    })

    return <>
        <Center>
            <Heading p="20px 0">
                {text.title + " " + translation.name_in}
            </Heading>
        </Center>
        <ProjectsList projects={projects} locale={locale} city_slug={city.slug}/>
    </>
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
            developers: {
                include: {
                    developers_translations: true,
                    cities: true,
                    projects: {
                        include: {
                            projects_translations: true,
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

    return {
        props: {
            locale: context.locale,
            city: city,
        }
    }
}