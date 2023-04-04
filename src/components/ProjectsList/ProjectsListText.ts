import TextChoice from "@/lib/translation";

export interface ProjectsListText {
    title: string,
    viewObjects: string
}

export const projectTextChoice: TextChoice<ProjectsListText> = {
    'en': {
        title: 'Here you can see the best projects from chosen developer',
        viewObjects: 'See all properties'
    },
    'ru': {
        title: 'Выберете понравившийся проект от вашего застройщика',
        viewObjects: 'Посмотреть все объекты в этом проекте'
    }
}