import {Card, CardBody, CardFooter, CardHeader, Divider, Heading, Link, SimpleGrid, Text} from "@chakra-ui/react";
import React from "react";
import {ProjectsListText, projectTextChoice} from "@/components/ProjectsList/ProjectsListText";
import TextChoice from "@/lib/translation";

function ProjectCard({
                         project,
                         locale,
                         text,
                         city_slug
                     }: { project: any, locale: string, text: ProjectsListText, city_slug: string }) {

    const translation = project.projects_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];

    return <Card>
        <CardHeader>
            <Heading size='md'>{project.name}</Heading>
        </CardHeader>
        <CardBody>
            <Text>
                {translation.description}
            </Text>
        </CardBody>
        <Divider/>
        <CardFooter>
            <Link href={'/' + locale + '/' + city_slug + '/project/' + project.slug}
                  color="blue">{text.viewObjects} -&gt;</Link>
        </CardFooter>
    </Card>
}

export function ProjectsList({
                                 projects,
                                 locale,
                                 city_slug
                             }: { projects: Array<any>, locale: string, city_slug: string }) {
    const text = projectTextChoice[locale as keyof TextChoice<ProjectsListText>]
    return <>
        <SimpleGrid minChildWidth="300px" spacing={10} padding="0 10px" m="20px 0">
            {
                projects.map((p: any, idx: number) => {
                    return <ProjectCard project={p} locale={locale} text={text} key={idx} city_slug={city_slug}/>
                })
            }
        </SimpleGrid>
    </>
}