import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const ses = new SESClient({});
const TO_ADDRESS = process.env.TO_ADDRESS!;
const FROM_ADDRESS = process.env.FROM_ADDRESS!;

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': 'https://nathanlloyd.dev',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValidEmail = (email: string) => EMAIL_REGEX.test((email || '').trim());
const hasHoneypot = (b: { company?: unknown }) => !!(b?.company && String(b.company).trim());

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (event.httpMethod === 'OPTIONS') {
            return { statusCode: 200, headers: CORS_HEADERS, body: '' };
        }

        let body: { name?: string; email?: string; message?: string; company?: string };
        try {
            body = JSON.parse(event.body ?? '{}');
        } catch {
            return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
        }

        if (hasHoneypot(body)) {
            return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true }) };
        }

        const { name, email, message } = body;
        if (
            !name ||
            !email ||
            !message ||
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof message !== 'string'
        ) {
            return {
                statusCode: 400,
                headers: CORS_HEADERS,
                body: JSON.stringify({ error: 'Missing required fields' }),
            };
        }

        const n = name.trim();
        const e = email.trim();
        const m = message.trim();
        if (!isValidEmail(e)) {
            return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid email address' }) };
        }

        await ses.send(
            new SendEmailCommand({
                Destination: { ToAddresses: [TO_ADDRESS] },
                Source: FROM_ADDRESS,
                Message: {
                    Subject: { Data: `Portfolio contact from ${n}` },
                    Body: {
                        Text: { Data: `From: ${n} <${e}>\n\n${m}` },
                    },
                },
            })
        );

        return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true }) };
    } catch (err) {
        console.error(err);
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Internal Server Error' }) };
    }
};
