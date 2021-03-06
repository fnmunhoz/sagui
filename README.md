# Sagui

[![Build Status](https://travis-ci.org/pirelenito/sagui.svg)](https://travis-ci.org/pirelenito/sagui)
[![npm version](https://badge.fury.io/js/sagui.svg)](https://badge.fury.io/js/sagui)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![Code Climate](https://codeclimate.com/github/pirelenito/sagui/badges/gpa.svg)](https://codeclimate.com/github/pirelenito/sagui)

Sagui is a modern approach on build infrastructure to front-end projects. It follows an opinionated **convention over configuration** approach, providing a solid foundation so that you can focus on writing your code.

**Beta release**: This branch is home of the upcoming 4.x release. For the current stable release, please refer to: [3.x.x](https://github.com/pirelenito/sagui/tree/3.x.x).

## Features:

Sagui acts as a front-end to a bunch of amazing technology to keep your development environment always up to date.

Here are some of its main features:

- Build and development infrastructure via [webpack](http://webpack.github.io/);
- Automated testing with [Jasmine](http://jasmine.github.io/) and [Karma](http://karma-runner.github.io/);
- Linting via [JavaScript Standard Style](http://standardjs.com/);
- Modern JavaScript language support with [Babel](http://babeljs.io/);
- Live-reload with "hot module replacement", specially for [React components](https://github.com/gaearon/react-transform);
- [CSS Modules](https://github.com/css-modules);
- [Sass lang](http://sass-lang.com/);
- and more...

Sagui strives to be the **last devDependency**:

- [Be local](https://twitter.com/pirelenito/status/682571493092515840), not global;
- [Be extensible](#custom-webpack-and-karma-config);
- Act in the shadows behind [npm scripts](https://docs.npmjs.com/misc/scripts);
- No more generators;
- No more boilerplate projects;
- No more starter kits;
- No more updating Babel and Webpack.

## Creating a new Sagui project

Start by creating a new folder to hold your project files:

```bash
mkdir my-project
cd my-project
```

Then, create a new NPM project (while at the project's folder):

```bash
npm init -y .
```

Install sagui **locally** as a development dependency:

```bash
npm install --save-dev sagui@'>4.0.0-rc'
```

After the install is completed, Sagui **bootstraps** its basic infrastructure, no extra step is required.

```bash
$ tree
.
├── .eslintrc
├── node_modules
│   └── sagui
├── package.json
├── sagui.config.js
└── src
    ├── index.html
    ├── index.js
    ├── index.css
    └── index.spec.js
```

From here on, you are ready to start development. You do that by **using common NPM run scripts**:

```bash
npm start
```

Run the tests!

```bash
npm test
```

Sagui manages the [package.json](https://docs.npmjs.com/files/package.json) scripts for you, creating additional tasks such as:

- `npm run sagui:test`
- `npm run sagui:test-watch`
- `npm run sagui:develop`
- `npm run sagui:build`
- `npm run sagui:dist`

Then you can start writing your code inside the `src/` folder.

## Configuration

Sagui supports two major project archetypes: **Pages** and **Library**.

They are not mutually exclusive, so it is possible to create a library project and use the pages archetype to create some demo pages for example.

### Pages

This is a static application that can be built around multiple pages. Each page is the combination of an `html` and a `js` files.

It is the default bootstrapped configuration, and it will build and serve a single page for your entire application based on the `src/index.js` and `src/index.html` files.

To change it and add more pages, you can add a custom configuration in the `sagui.config.js` file:

```js
/**
 * Sagui configuration object
 */
module.exports = {
  /**
   * Different application entry-points
   * Each page is a combination of a JavaScript file and a HTML file
   *
   * Example: 'index' -> 'index.html' and 'index.js'
   */
  pages: ['index', 'about']
}
```

And add additional `src/about.js` and `src/about.html` files for each page entry-point.

### Library

Create reusable libraries that can be shared across applications. Sagui will take care of the build process so that external libraries are not bundled and that you have a CommonJS module as the output.

To get started, the only required configuration is the library name:

```js
/**
 * Sagui configuration object
 */
module.exports = {
  /**
   * Library name (usually in CammelCase)
   * Example: ReactTransition, ReactRedux
   */
  library: 'ReactTransition'
}
```

#### External dependencies

Sagui will use the the **peerDependencies** information in the project's `package.json` to determine what are the external dependencies of the library that shouldn't be bundled in the final build.

## Advanced configuration

The internal architecture of Sagui is build arround plugins, each providing a set of functionalities that can be used during any of Sagui's actions.

If you need to disable any default behavior, it is possible via:

```js
/**
 * Sagui configuration object
 */
module.exports = {
  /**
   * List of Sagui plugins to disable
   */
  disabledPlugins: []
}
```

Default available plugins:

- **webpack-archetype-pages**: Add support for the above *Pages* configuration;
- **webpack-archetype-library**: Add support for the above *Library* configuration;
- **webpack-babel**: ES2015 support;
- **webpack-base**: Base paths and webpack plugins;
- **webpack-css-modules**: [CSS Modules](https://github.com/css-modules/css-modules) support;
- **webpack-define-node-env**: Populates `process.env.NODE_ENV`;
- **webpack-eslint**: ESLint support via [Standard](http://standardjs.com/);
- **webpack-json**: JSON loader;
- **webpack-media** Basic media loading support (JPG, PNG, GIF);
- **webpack-scss**: SCSS support.

### <a name="custom-webpack-and-karma-config"></a> Custom Webpack and Karma config

To overwrite and extend the default configuartion you can use the same `saqui.config.js` file to specify your custom configurations:

```js
/**
 * Sagui configuration object
 */
module.exports = {
  /**
   * Webpack configuration object
   * see: http://webpack.github.io/docs/configuration.html
   *
   * Will ovewrite and extend the default Sagui configuration
   */
  webpackConfig: {

  },

  /**
   * Karma configuration object
   * see: https://karma-runner.github.io/0.13/config/configuration-file.html
   *
   * Will overwrite and extend the default Sagui configuration
   */
  karmaConfig: {

  }
}
```

For more information on how the merging of Webpack configurations work check [webpack-merge](https://github.com/survivejs/webpack-merge).

## Development

To develop the tool locally, we will need to resort to a combination of a global [npm link](https://docs.npmjs.com/cli/link) and local links in projects.

You can start by linking Sagui globally. While at its folder:

```bash
SAGUI_LINK=true npm link
```

The environment variable is to inform Sagui that it is working in a "linked environment".

Then, **at the project you intend to use Sagui**, link it locally:

```bash
npm link sagui
```

Now, the project is set to use your development copy of Sagui. Unfortunately, you will need to run any command in the project providing the environment variable `SAGUI_LINK`:

```bash
SAGUI_LINK=true npm start
```
