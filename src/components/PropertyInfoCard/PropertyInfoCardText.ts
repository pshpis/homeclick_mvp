import TextChoice from "@/lib/translation";

export interface PropertyInfoCardText {
    title: string,
    project: string,
    type: string,
    roomType: string,
    floor: string,
    hasBalcony: string,
    hasParking: string,
    yes: string,
    no: string,
}

export const propertyInfoCardTextChoice: TextChoice<PropertyInfoCardText> = {
    en: {
        title: 'Property #',
        project: 'In project: ',
        type: 'Type: ',
        roomType: 'Room type: ',
        floor: 'Floor #',
        hasBalcony: 'Has balcony: ',
        hasParking: 'Has parking: ',
        yes: 'Yes',
        no: 'No'
    },
    ru: {
        title: 'Объект №',
        project: 'В проекте: ',
        type: 'Тип объекта: ',
        roomType: 'Планировка: ',
        floor: 'Этаж №',
        hasBalcony: 'Имеется балкон: ',
        hasParking: 'Имеется паркинг: ',
        yes: 'Да',
        no: 'Нет'
    }

}