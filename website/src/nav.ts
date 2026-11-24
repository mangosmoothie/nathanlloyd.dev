export const initNavMenu = (): void => {
    document.querySelectorAll<HTMLDetailsElement>('details[data-nav-menu]').forEach((menu) => {
        menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => menu.removeAttribute('open')));
        document.addEventListener('click', (event) => {
            if (event.target instanceof Node && !menu.contains(event.target)) menu.removeAttribute('open');
        });
    });
};
