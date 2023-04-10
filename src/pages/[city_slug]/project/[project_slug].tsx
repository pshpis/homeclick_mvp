import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import TextChoice from "@/lib/translation";
import {Center, Heading} from "@chakra-ui/react";
import React from "react";
import {PropertiesListText, propertiesTextChoice} from "@/components/PropertiesList/PropertiesListText";
import {PropertiesList} from "@/components/PropertiesList/PropertiesList";

export default function Home({project, locale, city_slug}: any) {
    const text: PropertiesListText = propertiesTextChoice[locale as keyof TextChoice<PropertiesListText>]
    return <>
        <Center>
            <Heading p="20px">
                {text.title} {project.name}
            </Heading>
        </Center>
        <PropertiesList properties={project.properties} locale={locale} city_slug={city_slug}/>
    </>
}

export async function getStaticPaths(context: any) {
    const _projects = await prisma.projects.findMany({
        include: {
            projects_translations: true,
            properties: true,
            developers: {
                include: {
                    cities: {
                        include: {
                            cities_translations: true,
                        }
                    },
                    developers_translations: true,
                }
            }
        }
    });

    const needPaths: Array<any> = [];
    context.locales.forEach((l: string) => {
        const localPaths = _projects.map((proj) => {
            return {
                params: {
                    city_slug: proj.developers.cities.slug,
                    project_slug: proj.slug
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
    const project_slug = context.params.project_slug
    let project = await prisma.projects.findUnique({
        where: {
            slug: project_slug,
        },
        include: {
            developers: {
                include: {
                    developers_translations: true,
                }
            },
            projects_translations: true,
            properties: {
                include: {
                    towers: true,
                    projects: true,
                    properties_translations: true,
                }
            }
        }
    });

    project = strToFloat(JSON.parse(JSON.stringify(project)));


    return {
        props: {
            project: project,
            locale: context.locale,
            city_slug: context.params.city_slug
        }
    }
}