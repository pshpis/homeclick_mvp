import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import {Center, Heading} from "@chakra-ui/react";
import React from "react";
import {ProjectsListText, projectTextChoice} from "@/components/ProjectsList/ProjectsListText";
import TextChoice from "@/lib/translation";
import {ProjectsList} from "@/components/ProjectsList/ProjectsList";

export default function Home({dev, locale, city_slug}: any) {
    const text: ProjectsListText = projectTextChoice[locale as keyof TextChoice<ProjectsListText>]
    return <>
        <Center>
            <Heading p="20px">
                {text.title}
            </Heading>
        </Center>
        <ProjectsList city_slug={city_slug} projects={dev.projects} locale={locale}/>
    </>
}

export async function getStaticPaths(context: any) {
    const _developers = await prisma.developers.findMany({
        include: {
            cities: true,
        }
    });
    const needPaths: Array<any> = [];

    context.locales.forEach((l: string) => {
        const localPaths = _developers.map((dev) => {
            return {
                params: {
                    city_slug: dev.cities.slug,
                    dev_slug: dev.slug,
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
    const dev_slug = context.params.dev_slug;
    let dev = await prisma.developers.findUnique({
        where: {
            slug: dev_slug,
        },
        include: {
            developers_translations: true,
            cities: true,
            projects: {
                include: {
                    projects_translations: true,
                },
            },
        }
    });

    dev = strToFloat(JSON.parse(JSON.stringify(dev)));

    return {
        props: {
            locale: context.locale,
            dev: dev,
            city_slug: context.params.city_slug,
        }
    }
}