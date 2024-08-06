# IonicAngularSsrAttachShadowTypeError

This app was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.3, with the command:

```bash
ng new ionic-angular-ssr-attachShadow-typeError --ssr=true --standalone=false --style=scss
```

It’s a modules-based Angular SSR app with Ionic added to it with the command:

```bash
npm install @ionic/angular @ionic/angular-server
```

The generated Angular app has been modified to use the older, Webpack-based `browser` builder. See the commit history for the changes.

The app demonstrates an `elm.attachShadow is not a function` TypeError in Ionic components in Angular SSR apps with Ionic version >= 8.2.4. The error does not appear in version 8.2.2 and prior, but in every later version (current latest: 8.2.6).

## Steps to reproduce the TypeError

1. Clone the repository and `cd` into it.

2. Install dependencies:

```bash
npm install
```

3. Build the SSR app:

```bash
npm run build:ssr
```

4. Initilise the SSR app:

```bash
npm run serve:ssr
```

5. Open your browser on <http://localhost:4000>.

6. The following error will appear in the terminal:

```
TypeError: elm.attachShadow is not a function
```

The demo has just an ion-button in `src/app.component.html`. You will also get the error with an ion-chip. I haven’t tested with any other Ionic components.

If you pin the version of `@ionic/angular` and `@ionic/angular-server` to 8.2.2 in `package.json` you will not get the error.
