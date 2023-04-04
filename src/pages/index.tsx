import {GetStaticProps, GetStaticPropsContext, PreviewData} from "next";
import {ParsedUrlQuery} from "querystring";
import {CitiesList} from "@/components/CitiesList/CitiesList";
import {prisma} from "@/lib/prisma";
import {cities, cities_translations} from "@prisma/client";
import {strToFloat} from "@/lib/validation";
import {remark} from 'remark';
import html from 'remark-html';

export type Props = {
    locale: string,
    cities: Array<any>,
    translations: cities_translations[],
}

export default function Home(props: Props) {
    return <CitiesList {...props}/>
}

export const getStaticProps: GetStaticProps =
    async (context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>) => {

        const _cities: cities[] = await prisma.cities.findMany();
        let _citiesTranslations = (await prisma.cities_translations.findMany()).map(async tr => {
            const file = await remark()
                .use(html)
                .process(tr.description as string)
            tr.description = String(file);
            return tr;
        });
        const _citiesTranslations2 = await Promise.all(_citiesTranslations)
        const _cities2 = JSON.parse(JSON.stringify(_cities));
        _cities2.forEach(strToFloat);
        return {
            props: {
                locale: context.locale as string,
                cities: _cities2,
                translations: _citiesTranslations2
            }
        };
    };
