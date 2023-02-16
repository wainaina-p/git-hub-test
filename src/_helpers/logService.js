import * as Sentry from '@sentry/browser';

function init() {
    Sentry.init({ dsn: "https://6cc0cce4fb6d4cb4a40e0b75896775f8@sentry.io/1783494" });
}

function log(error) {
    Sentry.captureException(error);
}

export default {
    init,
    log
}