import TextChoice from "@/lib/translation";

export interface DevelopersListText {
    title: string,
    viewObjects: string

}



export const developersTextChoice: TextChoice<DevelopersListText> = {
    'en': {
        title: 'Choise your developer in',
        viewObjects: 'View all project from this developer'
    },
    'ru': {
        title: 'Выберете подходящего девелопера в',
        viewObjects: 'Посмотрите все проекты от застройщика'
    }
}