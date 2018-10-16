declare module 'staple/snippets!*'

declare module 'staple/nls!*'

declare interface Preferences {

    load (): Preferences;

    put (key: string, value: any): Preferences;

    get (key: string): any;

    clear (): Preferences;

    readonly raw: { [key: string]: any };

    commit (): void;

}

declare interface Runnable {

    run (): void;

}

declare module 'staple/application' {

    class Application {

        static sharedInstance: Application;

        onCreate (): void;

        onResume (): void;

        onPause (): void;

        onTitleChanged (title: string): void;

        onLastInteractionFinished () : void;

        onDestroy (): void;

        onBrowserFeaturesNotSupport (features: string[]): boolean;

        getPreferences (name: string, shared?: boolean): Preferences;

        readonly namespace: string;

        readonly title: string;

        readonly meta: { [key: string]: string };

        readonly args: { [key: string]: string };

    }

}

declare module 'staple/interaction' {

    import { Application } from 'staple/application'

    class Interaction {

        onCreate (state: { [key: string]: any }): void;

        onRestoreInstanceState (state: { [key: string]: any }): void;

        onResume (): void;

        onInteractionResult (request: string, result: string, data?: any): boolean;

        onPause (): void;

        onSaveInstanceState (state: { [key: string]: any }): void;

        onDestroy (): void;

        onBackPressed (): void;

        finish (): void;

        startInteraction (name: string, extra?: { [key: string]: any }, request?: string): void;

        getExtra (): { [key: string]: any };

        readonly extra: { [key: string]: any };

        getUUID (): string;

        readonly uuid: string;

        getApplication (): Application;

        readonly application: Application;

        setResult (result: string, data: any): void;

        getPreferences (name: string, shared?: boolean): Preferences;

        setContent (content: string | HTMLElement): void;

        getTitle (): string;

        setTitle (title: string): string;

        title: string;

        select (selector: string): HTMLElement[];

        selectOne (elector: string): HTMLElement;

        scheduleRunnable (runnable: Runnable, mills: number, repeat?: boolean): number;

        cancelRunnables (runnable: number | Runnable): void;

    }

}

declare module 'staple/html-parser' {

    class HTMLParser {

        static parse (html: string): HTMLElement[];

    }

}

declare module 'staple/periodical-task' {

    class PeriodicalTask {

        constructor (mills: number, repeat?: boolean, runnable?: Runnable);

        start (restart?: boolean): void;

        stop (): void;

        readonly running: boolean;

        readonly id: number;

    }

}

declare module 'staple/uuid' {

    class UUID {

        static randomUUID(): string;

    }

}

declare module 'staple/aside' {

    import { Interaction } from 'staple/interaction'

    class Aside {

        constructor (interaction: Interaction, gravity: string, content: string | HTMLElement);

        setContent (content: string | HTMLElement): void;

        select (selector: string): HTMLElement[];

        selectOne (elector: string): HTMLElement;

        dismiss (): void;

        readonly showing: boolean;

        show (): void;

    }

}

declare module 'staple/dialog' {

    import { Interaction } from 'staple/interaction'

    class Dialog {

        constructor (interaction: Interaction, content: string | HTMLElement);

        setContent (content: string | HTMLElement): void;

        select (selector: string): HTMLElement[];

        selectOne (elector: string): HTMLElement;

        dismiss (): void;

        readonly showing: boolean;

        show (): void;

        cancel (): void;

        onBackPressed (): void;

        onShow (dialog: Dialog): void;

        onDismiss (dialog: Dialog): void;

        onCancel (dialog: Dialog): void;

        cancelable: boolean;

        cancelOnTouchOutside: boolean;

    }

}

declare module 'staple/popup' {

    import { Interaction } from 'staple/interaction'

    class Popup {

        constructor (interaction: Interaction, gravity: string, content: string | HTMLElement);

        setContent (content: string | HTMLElement): void;

        select (selector: string): HTMLElement[];

        selectOne (elector: string): HTMLElement;

        dismiss (): void;

        readonly showing: boolean;

        showAtLocation (x: number, y: number): void;

        adjustPopupPosition (): void;

        showAsDropDown (anchor: HTMLElement, offsetX: number, offsetY: number, gravity?: string): void;

    }

}

declare module 'staple/toast' {

    import { Interaction } from 'staple/interaction'

    class Toast {

        constructor (interaction: Interaction, content: string | HTMLElement, duration: string);

        setContent (content: string | HTMLElement): void;

        select (selector: string): HTMLElement[];

        selectOne (elector: string): HTMLElement;

        dismiss (): void;

        readonly showing: boolean;

        show (): void;

    }

}
