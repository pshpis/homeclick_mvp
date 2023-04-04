import {cities} from "@prisma/client";
import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import {DevelopersList} from "@/components/DevelopersList/DevelopersList";
import {Center, Heading} from "@chakra-ui/react";
import React from "react";
import {DevelopersListText, developersTextChoice} from "@/components/DevelopersList/DevelopersListText";
import TextChoice from "@/lib/translation";


export default function Home({locale, city}: any) {
    const translation = city.cities_translations.filter((t: any) => {
        return t.languages_code == locale;
    })[0];

    const text: DevelopersListText = developersTextChoice[locale as keyof TextChoice<DevelopersListText>];

    return <>
        <Center>
            <Heading p="20px 0">
                {text.title + " " + translation.name_in}
            </Heading>
        </Center>
        <DevelopersList developers={city.developers} locale={locale} text={text}></DevelopersList>
    </>
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

    console.log(needPaths);

    return {
        paths: needPaths,
        fallback: false, // can also be true or 'blocking'
    }
}

export async function getStaticProps(context: any) {
    console.log(context);
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
            areas: true,
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