import * as vscode from 'vscode';

export enum LogLevel {
    Debug = 'debug',
    Info = 'info',
    Warning = 'warn',
    Error = 'error',
}

const timestamp = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');
};

export class Logger {
    private static channel: vscode.OutputChannel;

    private static getChannel(): vscode.OutputChannel {
        if (!Logger.channel) {
            Logger.channel = vscode.window.createOutputChannel(
                '@lucas-labs/show-settings',
                'log'
            );
        }
        return Logger.channel;
    }

    private static printMessages(
        level: LogLevel = LogLevel.Info,
        name?: string,
        ...messages: any
    ): void {
        const nameStr = name ? ` [${name}]` : '';
        const levelStr = `[${level}]`.padStart(7, ' ');

        const strMessages = messages.map((message: any) => {
            const output = isObject(message)
                ? `${className(message)}: ${JSON.stringify(
                      message,
                      (_, value) =>
                          typeof value === 'bigint' ? value.toString() : value,
                      2
                  )}`
                : (message as string);
            return output;
        });

        Logger.getChannel().appendLine(
            `${timestamp()} ${levelStr}${nameStr} ${strMessages.join(', ')}`
        );
    }

    constructor(private name: string) {}

    public log(...messages: any[]): void {
        Logger.printMessages(LogLevel.Info, this.name, ...messages);
    }

    public info(...messages: any[]): void {
        Logger.printMessages(LogLevel.Info, this.name, ...messages);
    }

    public warn(...messages: any[]): void {
        Logger.printMessages(LogLevel.Warning, this.name, ...messages);
    }

    public error(...messages: any[]): void {
        Logger.printMessages(LogLevel.Error, this.name, ...messages);
    }

    public debug(...messages: any[]): void {
        Logger.printMessages(LogLevel.Debug, this.name, ...messages);
    }

    public static log(...messages: any[]): void {
        Logger.printMessages(LogLevel.Info, undefined, ...messages);
    }

    public static info(...messages: any[]): void {
        Logger.printMessages(LogLevel.Info, undefined, ...messages);
    }

    public static warn(...messages: any[]): void {
        Logger.printMessages(LogLevel.Warning, undefined, ...messages);
    }

    public static error(...messages: any[]): void {
        Logger.printMessages(LogLevel.Error, undefined, ...messages);
    }

    public static debug(...messages: any[]): void {
        Logger.printMessages(LogLevel.Debug, undefined, ...messages);
    }
}

const className = (object: any) => {
    const className = object?.constructor?.name;
    return className ? className : 'object';
};

const isObject = (stuff: any): stuff is object =>
    typeof stuff !== 'undefined' && stuff !== null && typeof stuff === 'object';
