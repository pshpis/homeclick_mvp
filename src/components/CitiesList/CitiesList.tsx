import TextChoice from "@/lib/translation";
import {HomeText, homeTextChoice} from "@/components/CitiesList/CitiesListsText";
import {Card, CardBody, CardFooter, CardHeader, Center, Divider, Heading, Link, SimpleGrid} from "@chakra-ui/react";
import React from "react";
import {Props} from "@/pages";

function CityCard({cityObj, text, slug, locale}: any) {
    return (
        <Card>
            <CardHeader>
                <Heading size='md'>{cityObj.name}</Heading>
            </CardHeader>
            <CardBody>
                <div dangerouslySetInnerHTML={{__html: cityObj.description}}>
                </div>
            </CardBody>
            <Divider/>
            <CardFooter>
                <Link href={'/' + locale + '/' + slug} color="blue">{text.viewObjects} -&gt;</Link>
            </CardFooter>
        </Card>
    );
}

export function CitiesList({locale, cities, translations}: Props) {
    const text: HomeText = homeTextChoice[locale as keyof TextChoice<HomeText>];

    return <>
        <Center p="30px">
            <Heading as={"h2"} size={"xl"}>{text.title}</Heading>
        </Center>
        <SimpleGrid minChildWidth="300px" spacing={10} padding="0 10px" m="20px 0">
            {
                cities.map((c, idx) => {
                    const t = translations.filter(t => {
                        return (t.cities_id === c?.id && t.languages_code === locale);
                    });

                    return <CityCard key={idx} cityObj={t[0]} slug={c.slug} text={text} locale={locale}/>;
                })
            }
        </SimpleGrid>
    </>;

}