import TextChoice from "@/lib/translation";

export interface AreasListText {
    viewDevelopers: string,
    viewProjects: string,
}

export const areasListTextChoice: TextChoice<AreasListText> = {
    ru: {
        viewDevelopers: 'Выбрать застройщика',
        viewProjects: 'Выбрать проект'
    },
    en: {
        viewProjects: 'View projects',
        viewDevelopers: 'View developers'
    }
}