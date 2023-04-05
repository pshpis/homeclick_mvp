import {cities} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import {Box, Button, Center, Divider, Heading, HStack, Input, Link, Select, VStack} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import TextChoice from "@/lib/translation";
import {AreasList} from "@/components/AreasList/AreasList";
import React from "react";

interface CityHubText {
    viewDevelopers: string,
    areas: string,
    viewProjects: string,
    waterfront: string,
    firstFilter: string,
    selectRoomType: string,
    selectPropertyType: string,
    selectArea: string,
    viewSelected: string,
    secondFilter: string,
    minPrice: string,
    maxPrice: string,

}

const cityHubTextChoice: TextChoice<CityHubText> = {
    ru: {
        viewDevelopers: 'Посмотреть всех застройщиков',
        areas: 'Выберите подходящий район в ',
        viewProjects: 'Посмотреть все проекты',
        waterfront: 'Посмотреть объекты на берегу моря',
        firstFilter: 'Подберем лучший объект для вас',
        selectRoomType: 'Выберите планировку',
        selectPropertyType: 'Выберите тип объекта',
        viewSelected: 'Посмотреть подходящие',
        selectArea: 'Выберите район',
        secondFilter: 'Отберите подходящие по цене',
        minPrice: 'Цена от',
        maxPrice: 'Цена до',
    },
    en: {
        viewDevelopers: 'View all developers',
        areas: 'Choose your perfect area in ',
        viewProjects: 'View all projects',
        waterfront: 'View all waterfront properties',
        firstFilter: 'Choice best property for you',
        selectRoomType: 'Select room type',
        selectPropertyType: 'Select property type',
        viewSelected: 'View selected properties',
        selectArea: 'Select area',
        secondFilter: 'Filter by price',
        minPrice: 'Min price',
        maxPrice: 'Max price',
    }
}

export default function Home({city, locale}: { city: any, locale: string }) {
    const translation = city.cities_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];
    const text = cityHubTextChoice[locale as keyof TextChoice<CityHubText>];

    const properties: Array<any> = [];
    city.developers.forEach((dev: any) => {
       dev.projects.forEach((project: any) => {
           properties.push(...project.properties);
       });
    });

    const roomTypes : Array<any> = [];
    properties.forEach((property: any) => {
       if (roomTypes.indexOf(property.room_type) === -1)
           roomTypes.push(property.room_type);
    });

    const propertyTypes: Array<any> = [];
    properties.forEach((property: any) => {
        if (propertyTypes.indexOf(property.property_type) === -1)
            propertyTypes.push(property.property_type);
    });

    const areasNames: Array<any> = [];
    properties.forEach((property: any) => {
        const current_area = property.projects.areas;
        const current_area_translation = current_area.areas_translations.filter((t: any) => {
            return t.languages_code == locale;
        })[0];

        if (areasNames.indexOf(current_area_translation.name) === -1)
            areasNames.push(current_area_translation.name);
    });

    return <Center as={VStack}>
        <Heading padding="10px 0">{translation.name}</Heading>
        <Box maxWidth="800px" padding="0 10px">
            <ReactMarkdown>{translation.description}</ReactMarkdown>
        </Box>
        <HStack mt={"30px"} spacing="30px">
            <Link href={`/${locale}/${city.slug}/developers`} textDecoration="none">
                <Button colorScheme="blue">{text.viewDevelopers}</Button>
            </Link>
            <Link href={`/${locale}/${city.slug}/projects`} textDecoration="none">
                <Button colorScheme="blue">{text.viewProjects}</Button>
            </Link>
            <Link href={`/${locale}/${city.slug}/waterfront-property`} textDecoration="none">
                <Button colorScheme="blue">{text.waterfront}</Button>
            </Link>
        </HStack>

        <Divider borderColor="black"/>
        <Heading padding="10px 0">{text.areas} {translation.name_in}</Heading>
        <AreasList _areas={city.areas} locale={locale} city_slug={city.slug}/>

        <Divider borderColor="black" margin="50px 0"/>

        <Heading padding="10px 0">{text.firstFilter}</Heading>
        <HStack maxWidth="700px" padding="10px 0">
            <Select placeholder={text.selectRoomType}>
                {roomTypes.map((rt: any, idx: number) => {
                    return <option value={rt + 'br'} key={idx}>{rt + 'br'}</option>;
                })}
            </Select>
            <Select placeholder={text.selectPropertyType}>
                {propertyTypes.map((prt: any, idx: number) => {
                    return <option value={prt} key={idx}>{prt}</option>;
                })}
            </Select>
            <Select placeholder={text.selectArea}>
                {areasNames.map((arn: any, idx: number) => {
                    return <option value={arn} key={idx}>{arn}</option>;
                })}
            </Select>
        </HStack>
        <Button colorScheme="blue">
            {text.viewSelected}
        </Button>

        <Divider borderColor="black" margin="50px 0"/>

        <Heading padding="10px 0">{text.secondFilter}</Heading>
        <VStack maxWidth="700px" padding="10px 0">
            <Select placeholder={text.selectPropertyType}>
                {propertyTypes.map((prt: any, idx: number) => {
                    return <option value={prt} key={idx}>{prt}</option>;
                })}
            </Select>
            <Input type="number" placeholder={text.minPrice}/>
            <Input type="number" placeholder={text.maxPrice}/>
        </VStack>
        <Button colorScheme="blue">
            {text.viewSelected}
        </Button>
    </Center>
}

export async function getStaticPaths(context: any) {
    const _cities: cities[] = await prisma.cities.findMany();
    const needPaths: Array<any> = [];
    context.locales.forEach((l: string) => {
        const localPaths = _cities.map((c) => {
            return {
                params: {
                    city_slug: c.slug,
                },
                locale: l,
            }
        });
        needPaths.push(...localPaths);
    });

    return {
        paths: needPaths,
        fallback: false, // can also be true or 'blocking'
    }
}

export async function getStaticProps(context: any) {
    const city_slug = context.params.city_slug;
    let city = await prisma.cities.findUnique({
        where: {
            slug: city_slug,
        },
        include: {
            cities_translations: true,
            developers: {
                include: {
                    developers_translations: true,
                    cities: true,
                    projects: {
                        include: {
                            projects_translations: true,
                            towers: true,
                            properties: {
                                include: {
                                    projects: {
                                        include: {
                                            areas: {
                                                include: {
                                                    areas_translations: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            areas: {
                                include: {
                                    areas_translations: true,
                                }
                            }
                        }
                    }
                }
            },
            areas: {
                include: {
                    areas_translations: true,
                }
            },
            metro_stations: true,
            malls: true,
        }
    });
    city = strToFloat(JSON.parse(JSON.stringify(city)));

    return {
        props: {
            locale: context.locale,
            city: city,
        }
    }
}