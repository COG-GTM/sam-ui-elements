# TestApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.10.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run test:e2e` to execute the [Playwright](https://playwright.dev/) smoke test. It boots the dev server and asserts the app renders. In CI it runs headless; locally it will reuse a running dev server if one is already up.

## Running the accessibility gate

Run `npm run test:a11y` to execute the WCAG 2.1 AA gate (`playwright.a11y.config.ts`, spec in `e2e/accessibility/`). It boots the dev server, visits every route declared in `src/app/app.module.ts`, scans each with [axe-core](https://github.com/dequelabs/axe-core) using the `wcag2a`, `wcag2aa`, `wcag21a`, and `wcag21aa` rule tags, and compares the violations against the committed baseline `e2e/accessibility/wcag-2.1-aa-baseline.json`. New violations fail the run; violations that no longer reproduce must be removed from the baseline. After an intentional change, regenerate the baseline with `UPDATE_A11Y_BASELINE=1 npm run test:a11y` and commit the result.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
