const VISIBLE_CLASS = 'is-visible';

const revealAll = (targets: HTMLElement[]): void => targets.forEach((target) => target.classList.add(VISIBLE_CLASS));

export const initReveal = (): void => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!('IntersectionObserver' in window)) {
        revealAll(targets);
        return;
    }
    const observer = new IntersectionObserver(
        (entries) =>
            entries
                .filter((entry) => entry.isIntersecting)
                .forEach((entry) => {
                    entry.target.classList.add(VISIBLE_CLASS);
                    observer.unobserve(entry.target);
                }),
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    targets.forEach((target) => observer.observe(target));
};
