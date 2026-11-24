const THEME_KEY = 'theme';

const readTheme = (): string | null => {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch {
        return null;
    }
};

const writeTheme = (theme: string): void => {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch {
        return;
    }
};

const toggleTheme = (): void => {
    const isDark = document.documentElement.classList.toggle('dark');
    writeTheme(isDark ? 'dark' : 'light');
};

export const initTheme = (): void => {
    if (readTheme() === 'dark') document.documentElement.classList.add('dark');
    document
        .querySelectorAll<HTMLElement>('[data-theme-toggle]')
        .forEach((toggle) => toggle.addEventListener('click', toggleTheme));
};
