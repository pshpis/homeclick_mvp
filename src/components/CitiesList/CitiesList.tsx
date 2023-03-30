import TextChoice from "@/lib/translation";
import {HomeText, homeTextChoice} from "@/components/CitiesList/CitiesListsText";
import {
    Center,
    Heading,
    SimpleGrid,
    Card,
    CardHeader,
    CardBody,
    Text,
    Divider,
    CardFooter,
    Link
} from "@chakra-ui/react";
import React from "react";
import {Props} from "@/pages";

function CityCard({cityObj, text} : any) {
    return (
        <Card>
            <CardHeader>
                <Heading size='md'>{cityObj.name}</Heading>
            </CardHeader>
            <CardBody>
                <Text>
                    {cityObj.description}
                </Text>
            </CardBody>
            <Divider/>
            <CardFooter>
                <Link href='#' color="blue">{text.viewObjects} -&gt;</Link>
            </CardFooter>
        </Card>
    );
}
export function CitiesList({locale, cities, translations} : Props) {
    const text: HomeText = homeTextChoice[locale as keyof TextChoice<HomeText>];

    return <>
        <Center p="30px">
            <Heading as={"h2"} size={"xl"}>{text.title}</Heading>
        </Center>
        <SimpleGrid minChildWidth="300px" spacing={10} padding="0 10px" mt="20px">
            {
                cities.map((c, idx) => {
                    const t = translations.filter(t => {
                        return (t.cities_id === c?.id && t.languages_code === locale);
                    });

                    return <CityCard key={idx} cityObj={t[0]} text={text}/>;
                })
            }
        </SimpleGrid>
    </>;

}