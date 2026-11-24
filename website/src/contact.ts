const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COOLDOWN_MS = 60_000;
const LAST_SENT_KEY = 'lastContact';
const ENDPOINT = '/api/contact';

export type ContactFields = { name: string; email: string; message: string; company: string };
export type ContactOutcome = { ok: boolean; message: string };
export type ContactDeps = {
    send: (fields: ContactFields) => Promise<Response>;
    readLastSentAt: () => number;
    writeLastSentAt: (at: number) => void;
    now: () => number;
};

const SUCCESS: ContactOutcome = { ok: true, message: 'Thank you, I will get back to you shortly.' };
const failure = (message: string): ContactOutcome => ({ ok: false, message });

export const isValidEmail = (email: string): boolean => EMAIL_PATTERN.test(email.trim());
export const isHoneypotFilled = (fields: ContactFields): boolean => fields.company.trim().length > 0;
export const isCoolingDown = (lastSentAt: number, now: number): boolean => now - lastSentAt < COOLDOWN_MS;

const readError = async (response: Response): Promise<string> => {
    try {
        const body: { error?: unknown } = await response.json();
        return typeof body.error === 'string' && body.error ? body.error : 'Failed to send';
    } catch {
        return 'Failed to send';
    }
};

export const submitContact = async (fields: ContactFields, deps: ContactDeps): Promise<ContactOutcome> => {
    if (isHoneypotFilled(fields)) return SUCCESS;
    if (!isValidEmail(fields.email)) return failure('Please provide a valid email address.');
    if (isCoolingDown(deps.readLastSentAt(), deps.now())) {
        return failure('Please wait a minute before sending another message.');
    }
    try {
        const response = await deps.send(fields);
        if (!response.ok) return failure(`Error: ${await readError(response)}`);
        deps.writeLastSentAt(deps.now());
        return SUCCESS;
    } catch {
        return failure('Network error, please try again or email me.');
    }
};

const readStoredNumber = (key: string): number => {
    try {
        return Number.parseInt(localStorage.getItem(key) ?? '0', 10) || 0;
    } catch {
        return 0;
    }
};

const writeStoredNumber = (key: string, value: number): void => {
    try {
        localStorage.setItem(key, String(value));
    } catch {
        return;
    }
};

const browserDeps: ContactDeps = {
    send: (fields) =>
        fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(fields),
        }),
    readLastSentAt: () => readStoredNumber(LAST_SENT_KEY),
    writeLastSentAt: (at) => writeStoredNumber(LAST_SENT_KEY, at),
    now: () => Date.now(),
};

const fieldValue = (data: FormData, name: keyof ContactFields): string => {
    const value = data.get(name);
    return typeof value === 'string' ? value : '';
};

const readFields = (form: HTMLFormElement): ContactFields => {
    const data = new FormData(form);
    return {
        name: fieldValue(data, 'name'),
        email: fieldValue(data, 'email'),
        message: fieldValue(data, 'message'),
        company: fieldValue(data, 'company'),
    };
};

const showOutcome = (form: HTMLFormElement, result: HTMLElement, outcome: ContactOutcome): void => {
    const message = result.querySelector<HTMLElement>('[data-contact-message]');
    const retry = result.querySelector<HTMLElement>('[data-contact-retry]');
    if (message) message.textContent = outcome.message;
    if (retry) retry.hidden = outcome.ok;
    result.dataset.state = outcome.ok ? 'success' : 'error';
    form.hidden = true;
    result.hidden = false;
    if (outcome.ok) form.reset();
};

const showForm = (form: HTMLFormElement, result: HTMLElement): void => {
    result.hidden = true;
    form.hidden = false;
};

export const initContactForm = (): void => {
    const form = document.querySelector<HTMLFormElement>('#contact-form');
    const result = document.querySelector<HTMLElement>('#contact-result');
    if (!form || !result) return;
    const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (submitButton) submitButton.disabled = true;
        try {
            showOutcome(form, result, await submitContact(readFields(form), browserDeps));
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });

    result.querySelector('[data-contact-retry]')?.addEventListener('click', () => showForm(form, result));
};
