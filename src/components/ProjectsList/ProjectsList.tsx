import {Card, CardBody, CardFooter, CardHeader, Divider, Heading, Link, SimpleGrid, Text} from "@chakra-ui/react";
import React from "react";
import {ProjectsListText} from "@/components/ProjectsList/ProjectsListText";
import {text} from "stream/consumers";

function ProjectCard({project, locale, text}: {project: any, locale: string, text: ProjectsListText}){
    console.log(project);
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
            <Link href={'/' + locale + '/project/' + project.slug} color="blue">{text.viewObjects} -&gt;</Link>
        </CardFooter>
    </Card>
}
export function ProjectsList({projects, locale, text}: { projects: Array<any>, locale: string, text: ProjectsListText }){
    console.log(projects);
    return <>
        <SimpleGrid minChildWidth="300px" spacing={10} padding="0 10px" m="20px 0">
            {
                projects.map((p: any, idx: number) => {
                    return <ProjectCard project={p} locale={locale} text={text} key={idx}/>
                })
            }
        </SimpleGrid>
    </>
}