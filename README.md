## Intro
This is a `CRUD` app that is a functionality of the project RnctAdmin. It requires to be installed in RnctAdmin as an npm module to work however it can work outside of it. It uses AJAX and PHP to modify the MYSQLI database.

## NB:

If you don't know anything about RNCT then this is not for you because this is aN AJAX and PHP based personal project.

## Functionality
- create, delete, update pages
- add title, description, keywords, link, link text, page type and category
- directly create the php file in the specified dir

## Database Installation
- If you don't have the tables yet then it'll created automatically
- edit the name of the database if you already have them, and add the dir where the files will be created edit the `settings.json` and add the connection settings.

```json
"tables": {
    "pages": "yourpagesdbname"
},
"folders": {
    "pages": "files/... your dir",
},
```

## Installation
### With RnctAdmin
- Link the Js and Css files in the `dist` folder of `RnctAdmin` and the other dependencies

#### NB:
Link it after the `CoreUI` Js Script and `Jquery` before the end of the body tag.

To do so just add jquery in the `settings.json` file in `js` and the dependencies and the library in the `jslazy`.
Here is how the `settings.json` looked like during the test

``` json
"css": {
    "fontawesome-free": "node_modules/@fortawesome/fontawesome-free/css/all.css",
    "perfect-scrollbar": "node_modules/perfect-scrollbar/css/perfect-scrollbar.css",
    "bootstrap": "node_modules/bootstrap/dist/css/bootstrap.min.css",
    "bootstrap-iconpicker": "node_modules/bootstrap-iconpicker-latest/dist/css/bootstrap-iconpicker.css",
    "@coreui": "node_modules/@coreui/coreui/dist/css/coreui.min.css",
    "rnct-admin-module": "dist/css/rnct-admin-module.css"
},
"js": {
    "jquery": "node_modules/jquery/jquery.min.js"
},
"jslazy": {
    "perfect-scrollbar": "node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js",
    "popper.js": "node_modules/popper.js/dist/umd/popper.min.js",
    "@coreui": "node_modules/@coreui/coreui/dist/js/coreui.min.js",
    "bootstrap.bundle": "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
    "bootstrap-iconpicker": "node_modules/bootstrap-iconpicker-latest/dist/js/bootstrap-iconpicker.bundle.min.js",
    "rnct-admin-module": "dist/js/rnct-admin-module.js",
    "rnct-pages": "node_modules/rnct-pages/dist/js/rnct-pages.js"
}
```

### Without RnctAdmin
clone the git repo and install the dependencies by opening the folder in your terminal and run
```npm
$ npm install
```

Then just launch `index.php` in your server

## Usage

- Just create it as a js object

```html
<div id="#wrapper"></div>
```

```js
$(document).ready(function(){
    var rnctSidebar = new RnctPages('#wrapper');
})
```

## Options

- asPanel


```html
<button type="button" id="trigger">Show</button>
<div id="wrapper"></div>
```

```js
$(document).ready(function(){
    var rnctPages = new RnctPages('#wrapper'{
        trigger: "#trigger", // a button selector to display the this object if asPanel is set to true
        asPanel: true // display it as a panel that can be closed
    });
})
```

- all options

```js
$(document).ready(function(){
    var rnctPages = new RnctPages('#wrapper'{
        trigger: null, // a button selector to display the this object if asPanel is set to true
        asPanel: false, // display it as a panel that can be closed
        column_1: 8, // modifies the column bootstrap grid
    });
})
```
