import {cities} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import {Box, Button, Center, Divider, Heading, HStack, Link, VStack} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import TextChoice from "@/lib/translation";
import {AreasList} from "@/components/AreasList/AreasList";
import React from "react";

interface CityHubText {
    viewDevelopers: string,
    areas: string,
    viewProjects: string,
    waterfront: string,
}

const cityHubTextChoice: TextChoice<CityHubText> = {
    ru: {
        viewDevelopers: 'Посмотреть всех застройщиков',
        areas: 'Выберите подходящий район в ',
        viewProjects: 'Посмотреть все проекты',
        waterfront: 'Посмотреть объекты на берегу моря'
    },
    en: {
        viewDevelopers: 'View all developers',
        areas: 'Choose your perfect area in ',
        viewProjects: 'View all projects',
        waterfront: 'View all waterfront properties',
    }
}

export default function Home({city, locale}: { city: any, locale: string }) {
    const translation = city.cities_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];
    const text = cityHubTextChoice[locale as keyof TextChoice<CityHubText>];

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