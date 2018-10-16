/// <reference path="node_modules/staple.js/dist/staple.d.ts"/>

declare module 'staple/application' {

    interface Application {


    }

}

declare module 'staple/interaction' {

    interface Interaction {

## IF jQuery ##
        find (selector: string): JQuery<HTMLElement>;
## ELSE ##
## FI jQuery ##

    }

}

declare module 'staple/aside' {

    interface Aside {

## IF jQuery ##
        find (selector: string): JQuery<HTMLElement>;
## ELSE ##
## FI jQuery ##

    }

}

declare module 'staple/dialog' {

    interface Dialog {

## IF jQuery ##
        find (selector: string): JQuery<HTMLElement>;
## ELSE ##
## FI jQuery ##

    }

}

declare module 'staple/popup' {

    interface Popup {

## IF jQuery ##
        find (selector: string): JQuery<HTMLElement>;
## ELSE ##
## FI jQuery ##

    }

}

declare module 'staple/toast' {

    interface Toast {

## IF jQuery ##
        find (selector: string): JQuery<HTMLElement>;
## ELSE ##
## FI jQuery ##

    }

}
