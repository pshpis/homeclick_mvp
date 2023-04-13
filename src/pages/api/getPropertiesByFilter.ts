// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {prisma} from "@/lib/prisma";
import {strToFloat} from "@/lib/validation";
import {getPropertiesFromCity} from "@/lib/nestedRequests";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const {city_slug, property_type, min_price, max_price} = req.query;

    let city = await prisma.cities.findUnique({
        where: {
            slug: city_slug as string,
        },
        include: {
            developers: {
                include: {
                    projects: {
                        include: {
                            properties: {
                                include: {
                                    projects: {
                                        include: {
                                            areas: true
                                        }
                                    },
                                    properties_translations: true,
                                }
                            },
                        }
                    }
                }
            }
        }
    });

    city = strToFloat(JSON.parse(JSON.stringify(city)));

    let properties = getPropertiesFromCity(city);
    properties = properties.filter((prop: any) => {
        return prop.property_type === property_type && prop.unit_price_aed >= parseInt(min_price as string) && prop.unit_price_aed <= parseInt(max_price as string);
    });

    res.status(200).json(properties);
}
