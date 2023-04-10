import {Card, CardBody, CardFooter, CardHeader, Divider, Heading, Link, SimpleGrid, Text} from "@chakra-ui/react";
import React from "react";
import {PropertiesListText, propertiesTextChoice} from "@/components/PropertiesList/PropertiesListText";
import TextChoice from "@/lib/translation";

function PropertyCard({
                          property,
                          locale,
                          text,
                          city_slug
                      }: { property: any, locale: string, text: PropertiesListText, city_slug: string }) {
    const slug = `${property.property_type}-in-${property.projects.slug}-${property.id}`;
    const translation = property.properties_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];
    return <Card>
        <CardHeader>
            <Heading size='md'>{text.property} {property.name}</Heading>
        </CardHeader>
        <CardBody>
            <Text>
                {translation.description} <br/>
                {text.roomType} {property.room_type + 'br'}<br/>
            </Text>
        </CardBody>
        <Divider/>
        <CardFooter>
            <Link href={'/' + locale + '/' + city_slug + '/property/' + slug}
                  color="blue">{text.viewObjects} -&gt;</Link>
        </CardFooter>
    </Card>
}

export function PropertiesList({
                                   properties,
                                   locale,
                                   city_slug
                               }: { properties: Array<any>, locale: string, city_slug: string }) {
    const text: PropertiesListText = propertiesTextChoice[locale as keyof TextChoice<PropertiesListText>]
    return <>
        <SimpleGrid minChildWidth="300px" spacing={10} padding="0 10px" m="20px 0">
            {
                properties.map((p: any, idx: number) => {
                    return <PropertyCard property={p} locale={locale} text={text} key={idx} city_slug={city_slug}/>
                })
            }
        </SimpleGrid>
    </>
}