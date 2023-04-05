import {Card, CardBody, CardFooter, CardHeader, Divider, Heading, Link, SimpleGrid, Text} from "@chakra-ui/react";
import {DevelopersListText, developersTextChoice} from "@/components/DevelopersList/DevelopersListText";
import React from "react";
import TextChoice from "@/lib/translation";

function DeveloperCard({developer, locale, text}: any) {
    const translation = developer.developers_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];

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
                               }: { developers: any, locale: string }) {
    const text: DevelopersListText = developersTextChoice[locale as keyof TextChoice<DevelopersListText>];
    return <>
        <SimpleGrid minChildWidth="300px" spacing={10} padding="0 10px" m="20px 0">
            {developers.map((dev: any, idx: number) => {
                return <DeveloperCard developer={dev} key={idx} locale={locale} text={text}/>
            })}
        </SimpleGrid>
    </>
}