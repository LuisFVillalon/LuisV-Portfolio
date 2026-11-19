/** Vercel Cron sends `Authorization: Bearer $CRON_SECRET`. Without a secret the jobs refuse to run. */
export function isAuthorizedCron(req: Request): boolean {
    const secret = process.env.CRON_SECRET;
    return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`;
}
