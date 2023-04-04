import TextChoice from "@/lib/translation";

export interface PropertiesListText {
    title: string,
    viewObjects: string,
    property: string,
    floor: string,
    roomType: string,
}

export const propertiesTextChoice: TextChoice<PropertiesListText> = {
    'en': {
        title: 'Here you can see the best properties from ',
        viewObjects: 'View more',
        property: 'Property ',
        floor: 'Floor number: ',
        roomType: 'Room type: '
    },
    'ru': {
        title: 'Выберете понравившийся объект в ',
        viewObjects: 'Узнать больше',
        property: 'Объект ',
        floor: 'Этаж: ',
        roomType: 'Планировка: ',

    }
}