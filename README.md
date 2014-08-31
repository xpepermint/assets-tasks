# assets-tasks

![Build Status](https://travis-ci.org/xpepermint/assets-tasks.svg?branch=master)&nbsp;[![NPM version](https://badge.fury.io/js/assets-tasks.svg)](http://badge.fury.io/js/assets-tasks)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/assets-tasks.svg)](https://gemnasium.com/xpepermint/assets-tasks)

Common assets tasks for NodeJS.

## Installation

Install the [npm](https://www.npmjs.org/package/assets-tasks) package. This module currently compiles `.coffee`, `.styl`, `.jade`, `images` and `fonts`. Assets are `versionized` and `gziped` on precompile.

```
npm install assets-tasks --save
```

## Example

```js
var assets = require('assets-tasks');
// clean assets
assets.clean();
// precompile
assets.compile();
// precompile
assets.precompile();
// read precompiled asset name
assets.assetPath('originalFileName.css'); // e.g. originalFileName.28djamb321.css
```
