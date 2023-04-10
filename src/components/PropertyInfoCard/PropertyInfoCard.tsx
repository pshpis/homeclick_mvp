import {Card, CardBody, CardHeader, Heading, Text} from "@chakra-ui/react";
import React from "react";
import {PropertyInfoCardText} from "@/components/PropertyInfoCard/PropertyInfoCardText";

export function PropertyInfoCard({property, text, locale}: { property: any, text: PropertyInfoCardText, locale: string}) {
    const translation = property.properties_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];
    return <Card>
        <CardHeader>
            <Heading size='md'>{text.title}{property.name}</Heading>
        </CardHeader>
        <CardBody>
            <Text>
                {text.type} {property.property_type} <br/>
                {translation.description} <br/>
                {text.roomType} {property.room_type + 'br'} <br/>
                {text.hasBalcony} {property.has_balcony ? text.yes : text.no} <br/>
                {text.hasParking} {property.has_parking ? text.yes : text.no} <br/>
            </Text>
        </CardBody>
    </Card>
}