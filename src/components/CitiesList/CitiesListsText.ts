import TextChoice from "@/lib/translation";

export interface HomeText {
    title: string,

    viewObjects: string
}


export const homeTextChoice: TextChoice<HomeText> = {
    'en': {
        title: 'Please choice your city',
        viewObjects: 'View objects'
    },
    'ru': {
        title: 'Пожалуйста выберете город, объекты в котором вам интересны',
        viewObjects: 'Смотреть объекты'
    }
}