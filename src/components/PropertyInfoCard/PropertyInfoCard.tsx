import {Card, CardBody, CardHeader, Heading, Text} from "@chakra-ui/react";
import React from "react";
import {PropertyInfoCardText} from "@/components/PropertyInfoCard/PropertyInfoCardText";

export function PropertyInfoCard({property, text}: { property: any, text: PropertyInfoCardText }) {

    return <Card>
        <CardHeader>
            <Heading size='md'>{text.title}{property.id}</Heading>
        </CardHeader>
        <CardBody>
            <Text>
                {text.type} {property.property_type} <br/>
                {text.floor} {property.floor} <br/>
                {text.roomType} {property.room_type} <br/>
                {text.hasBalcony} {property.has_balcony ? text.yes : text.no} <br/>
                {text.hasParking} {property.has_parking ? text.yes : text.no} <br/>
            </Text>
        </CardBody>
    </Card>
}