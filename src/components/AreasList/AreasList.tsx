import {
    Box,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Heading,
    Link,
    SimpleGrid,
    VStack
} from "@chakra-ui/react";
import React from "react";
import {AreasListText, areasListTextChoice} from "@/components/AreasList/AreasListText";
import TextChoice from "@/lib/translation";
import ReactMarkdown from "react-markdown";

function AreaCard({area, text, translation, locale, city_slug}: any) {
    return <Card>
        <CardHeader>
            <Heading size='md'>{translation.name}</Heading>
        </CardHeader>
        <CardBody>
            <Box>
                <ReactMarkdown>{translation.description}</ReactMarkdown>
            </Box>
        </CardBody>
        <Divider/>
        <CardFooter as={VStack}>
            <Link href={'/' + locale + '/' + city_slug + '/developers/in-' + area.slug}
                  color="blue">{text.viewDevelopers} -&gt;</Link>
            <Link href={'/' + locale + '/' + city_slug + '/projects/in-' + area.slug}
                  color="blue">{text.viewProjects} -&gt;</Link>
        </CardFooter>
    </Card>
}

export function AreasList({_areas, locale, city_slug}: { _areas: Array<any>, locale: string, city_slug: string }) {
    const text = areasListTextChoice[locale as keyof TextChoice<AreasListText>];
    return <>
        <SimpleGrid minChildWidth="300px" spacing={10} padding="0 10px" m="20px 0">
            {
                _areas.map((a: any, idx: number) => {
                    const translation = a.areas_translations.filter((t: any) => {
                        return t.languages_code == locale;
                    })[0];
                    return <AreaCard area={a} translation={translation} text={text} locale={locale} key={idx}
                                     city_slug={city_slug}/>
                })
            }
        </SimpleGrid>
    </>
}