import TextChoice from "@/lib/translation";

export interface ProjectsListText {
    title: string,
    viewObjects: string
}

export const projectTextChoice : TextChoice<ProjectsListText> = {
    'en': {
        title: 'Here you can see the best projects from chosen developer',
        viewObjects: 'See all towers in this project'
    },
    'ru': {
        title: 'Выберете понравившийся проект от вашего застройщика',
        viewObjects: 'Посмотреть все здания в этом проекте'
    }
}