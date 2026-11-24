import { describe, expect, it, vi } from 'vitest';
import { isCoolingDown, isHoneypotFilled, isValidEmail, submitContact } from './contact';
import type { ContactDeps, ContactFields } from './contact';

const fields = (overrides: Partial<ContactFields> = {}): ContactFields => ({
    name: 'Ada',
    email: 'ada@example.com',
    message: 'Hello',
    company: '',
    ...overrides,
});

const deps = (overrides: Partial<ContactDeps> = {}): ContactDeps => ({
    send: vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 })),
    readLastSentAt: () => 0,
    writeLastSentAt: vi.fn(),
    now: () => 1_000_000,
    ...overrides,
});

describe('contact validation', () => {
    it('accepts well formed email addresses', () => {
        expect(isValidEmail(' ada@example.com ')).toBe(true);
    });

    it('rejects malformed email addresses', () => {
        expect(isValidEmail('ada@example')).toBe(false);
        expect(isValidEmail('')).toBe(false);
    });

    it('detects a filled honeypot', () => {
        expect(isHoneypotFilled(fields({ company: 'Acme' }))).toBe(true);
        expect(isHoneypotFilled(fields({ company: '  ' }))).toBe(false);
    });

    it('cools down for one minute after a send', () => {
        expect(isCoolingDown(1_000, 60_999)).toBe(true);
        expect(isCoolingDown(1_000, 61_000)).toBe(false);
    });
});

describe('submitContact', () => {
    it('sends valid fields and records the send time', async () => {
        const d = deps();
        const outcome = await submitContact(fields(), d);
        expect(outcome.ok).toBe(true);
        expect(d.send).toHaveBeenCalledWith(fields());
        expect(d.writeLastSentAt).toHaveBeenCalledWith(1_000_000);
    });

    it('pretends to succeed without sending when the honeypot is filled', async () => {
        const d = deps();
        const outcome = await submitContact(fields({ company: 'Acme' }), d);
        expect(outcome.ok).toBe(true);
        expect(d.send).not.toHaveBeenCalled();
    });

    it('refuses an invalid email without sending', async () => {
        const d = deps();
        const outcome = await submitContact(fields({ email: 'nope' }), d);
        expect(outcome).toEqual({ ok: false, message: 'Please provide a valid email address.' });
        expect(d.send).not.toHaveBeenCalled();
    });

    it('refuses a second send inside the cooldown', async () => {
        const d = deps({ readLastSentAt: () => 999_000 });
        const outcome = await submitContact(fields(), d);
        expect(outcome.ok).toBe(false);
        expect(d.send).not.toHaveBeenCalled();
    });

    it('surfaces the server error message', async () => {
        const send = vi.fn(
            async () => new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400 })
        );
        const d = deps({ send });
        const outcome = await submitContact(fields(), d);
        expect(outcome).toEqual({ ok: false, message: 'Error: Invalid email address' });
        expect(d.writeLastSentAt).not.toHaveBeenCalled();
    });

    it('falls back to a generic message when the error body is not JSON', async () => {
        const send = vi.fn(async () => new Response('<html>', { status: 502 }));
        const outcome = await submitContact(fields(), deps({ send }));
        expect(outcome).toEqual({ ok: false, message: 'Error: Failed to send' });
    });

    it('reports network failures', async () => {
        const send = vi.fn(async () => Promise.reject(new Error('offline')));
        const outcome = await submitContact(fields(), deps({ send }));
        expect(outcome).toEqual({ ok: false, message: 'Network error, please try again or email me.' });
    });
});
