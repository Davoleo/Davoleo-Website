const Metalsmith = require("metalsmith");

//Handlebars templates and SCSS
const templates = require("metalsmith-in-place");
const sass = require("metalsmith-sass");
//const dataLoader = require("metalsmith-data-loader");
const fs = require('fs');
const Handlebars = require('handlebars');

let devMode = false;

//Register all Handlebars Partials in the partials directory
fs.readdir('./src/partials', (err, files) => {
    if (err)
        console.error(err);
    console.log("Loading " + files.length + " Partials...");
    files.forEach(file => {
        if (file.endsWith(".hbs"))
            Handlebars.registerPartial(file.split('.')[0], require('./src/partials/' + file));
    })
});

const helpers = require("./helpers/misc_helpers");
helperKeys = Object.keys(helpers);
console.log("Loading " + helperKeys.length + " Helpers...")
helperKeys.forEach(key => {
    Handlebars.registerHelper(key, helpers[key]);
});


const smithInstance = Metalsmith(__dirname)
    .source("src")
    .destination("dist")
    .metadata({
        author: "Davoleo",
        site: "https://davoleo.net"
    })
    //.use(dataLoader({
    //    dataProperty: "data",
    //    removeSource: true,
    //    match: "*.{hbs,html}"
    //}))
    .use(templates({
        pattern: '*.{hbs,handlebars}',
    }))
    .use(sass({
        outputStyle: "expanded",
        outputDir: "css/",
        sourceMaps: true,
        sourceMapsContents: true
    }));


function metalsmithBuild() {
    smithInstance
    .build((err) => {
        if (err)
            throw err;
    });
}

metalsmithBuild();

module.exports = {
    metalsmithBuild,
    devMode
};