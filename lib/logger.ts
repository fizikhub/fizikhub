/**
 * Enterprise Level Logger for Fizikhub
 * Bu logger, uygulamanın hatalarını, uyarılarını ve info mesajlarını standartlaştırır.
 * İleride Datadog, Sentry veya Axiom gibi bir servise tek satırla bağlanmak için tasarlanmıştır.
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogMeta {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === "development";

    private formatMessage(level: LogLevel, message: string, meta?: LogMeta) {
        const timestamp = new Date().toISOString();
        const metaString = meta ? `\nMeta: ${JSON.stringify(meta, null, 2)}` : "";
        
        // Sunucu ortamında veya development'ta renklendirilmiş (basit) console prefixleri
        const prefixes = {
            info: "🔵 [INFO]",
            warn: "🟠 [WARN]",
            error: "🔴 [ERROR]",
            debug: "🟢 [DEBUG]",
        };

        return `${prefixes[level]} [${timestamp}] ${message}${metaString}`;
    }

    info(message: string, meta?: LogMeta) {
        console.info(this.formatMessage("info", message, meta));
    }

    warn(message: string, meta?: LogMeta) {
        console.warn(this.formatMessage("warn", message, meta));
    }

    error(message: string, error?: Error | unknown, meta?: LogMeta) {
        // Hata nesnesini parçalayalım
        const errMeta = error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: this.isDevelopment ? error.stack : undefined, // Stack'i sadece dev'de ver
            ...meta
        } : { error, ...meta };

        console.error(this.formatMessage("error", message, errMeta));

        // TO-DO: Sentry.captureException(error, { extra: meta });
    }

    debug(message: string, meta?: LogMeta) {
        if (this.isDevelopment) {
            console.debug(this.formatMessage("debug", message, meta));
        }
    }
}

export const logger = new Logger();
