/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_API_URL: string;
        REACT_APP_MEDIA_URL: string;
        REACT_APP_STATIC_URL: string;
        NODE_ENV: 'development' | 'production' | 'test';
        PUBLIC_URL: string;
    }
}
declare module '*.module.scss' {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}