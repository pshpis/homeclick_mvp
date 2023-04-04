import {Card, CardBody, CardFooter, CardHeader, Divider, Heading, Link, SimpleGrid, Text} from "@chakra-ui/react";
import {DevelopersListText} from "@/components/DevelopersList/DevelopersListText";
import React from "react";

function DeveloperCard({developer, locale, text}: any) {
    const translation = developer.developers_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];

    console.log(translation);

    return (
        <Card>
            <CardHeader>
                <Heading size='md'>{developer.name}</Heading>
            </CardHeader>
            <CardBody>
                <Text>
                    {translation.description}
                </Text>
            </CardBody>
            <Divider/>
            <CardFooter>
                <Link href={'/' + locale + '/' + developer.cities.slug + '/developer/' + developer.slug}
                      color="blue">{text.viewObjects} -&gt;</Link>
            </CardFooter>
        </Card>
    );
}

export function DevelopersList({
                                   developers,
                                   locale,
                                   text
                               }: { developers: any, locale: string, text: DevelopersListText }) {
    return <>
        <SimpleGrid minChildWidth="300px" spacing={10} padding="0 10px" m="20px 0">
            {developers.map((dev: any, idx: number) => {
                return <DeveloperCard developer={dev} key={idx} locale={locale} text={text}/>
            })}
        </SimpleGrid>
    </>
}