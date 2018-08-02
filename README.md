# ListApp
Displays a list of softwares, reads .status files and change the design of the blocks accordingly.

Designed to be called in an iframe.
## How to install
* Clone or unzip it into a web server
* Configure categories in categories.json
* List your apps in applis.conf (JSON)
* Don't forget to include the logos in the IMG folder
* Call index.html in an iframe

Aside from that, you're free to generate .status files however youlike, put them in the app_status folder and list the status in the switch function inside main.js.

## index.html
Start point, loads :
* Twitter Bootstrap
* FontAwesome
* jQuery
* Moment.js

Main layout, designed for iframe, divived in three parts :
* the search field
* the div that will recieve the blocks generated by JS
* the footer containing static informations

## main.js
Main.JS is the core of this application.

It starts with the initialisation of Moment.JS locale (FR), and an autoloading function like recommanded for jQuery. This function load the list of apps for the first time and binds the search field with the loading function in order to optain direct filter on text input.

The most important function is load_list() :
* It loads the categories (JSON) and store them in a variable, accessible throughout all the function.
* It sort apps by categories, to ease the process.
* Then for each categories, it sorts app by name, ascending.
* And for each app, it composes a div with different elements :
    * Icon, default if not provided
    * Maintenance if provided directly in applis.conf
    * Loads the status_file if provided
    * Then, from the status, apply specific CSS class to the <li> containing the link to the app homepage
    * Finally, it compose the rest of the HTML (<a> and blocks inside it)
* At the end, it composes the whole HTML with titles and number of apps inside each category and send it into the div acting as container.

/** IMPORTANT **/

On the $.ajax jQuery function, the parameter async is set to false to be able to pass the information gathered to a variable outside of this function. For more information see here : https://stackoverflow.com/questions/1478295/what-does-async-false-do-in-jquery-ajax

## Main.CSS

You should not have to change anything other than the colors in this file. We've used CSS variables to ease this process. For each status (we have 4 : OK, WARNING, CRITICAL, UNKNOWN), there's two colors :
--STATUS-color : this is the principal color, for border and background
--STATUS-color-boxshadow : is the same color, but the opacity is very low (0.2) and it's used for the color of the shadow appearing on mouseover (:hover)

Both of them are declared with RGBA, so it's easy apply the same color and only change the opacity.


## JSON Files for configuration
### applis.conf

A JSON collection of objects, each one representing an app, for example :
```js
{
"name":"Ressources Humaines",
"icon":"./img/ciril.png",
"desc":"Logiciel RH",
"tags":"ciril rh",
"status_file":"CirilRH.status",
"url":"http://10.0.0.52:83/",
"cat":"1"
}
```

The first object is called "Default" and act as a default value if not provided in another object.

* Name : The name of the app, shown on the block
* Icon : If provided, the path to the icon in the img folder. If not, default applied
* Desc : Description of the app, used in the tooltip (title) of the block, for more information on the app
* Tags : Thoses tags are search when filtering, along with the name of the app for better results. For example, "Zimbra" is the name the app, but it has "mail" and "email" tags so that users can find it without knowing the name or its spelling
* Status_file : name of the status file (if provided, unless ignored) from wich to read the status of the app (See https://github.com/Mairie-de-Saint-Maur/AppMonitor - statusFileGen).
* Url : URL to the homepage of the app, the user can click on the block to get there.
* Cat : "category" of the app (see further). Apps are sorted in "themes" or "categories", defined in a JSON file. The number here is the index from this file.

#### Scheduled Maintenance
We use "Scheduled downtimes" from Nagios to change the status of an app to WARNING, but if used independently, the "maintenance" property is there for it ! Type in a collection of objects with start and end datetimes and the status will change to "WARNING", changing the color of the block to Yellow.

```js
{
"name":"Ressources Humaines",
"icon":"./img/ciril.png",
"desc":"Logiciel RH",
"tags":"ciril rh",
"status_file":"CirilRH.status",
"url":"http://10.0.0.52:83/",
"cat":"1",
"maintenance":[
    {"start":"2018-06-27 08:00:00","end":"2018-06-27 19:00:00"}
]
}
```

### categories.json

A JSON file containing a single object, listing the categories or themes in wich the apps will be sorted.
For example :
```js
{
    "1" : "Administratif",
    "2" : "Etat Civil, Elections",
    "3" : "Ressources & Médias",
    "4" : "DSI",
    "5" : "Culture",
    "6" : "Espace public"
}
```

## Folders
### app_status
This folder contains the .status file from wich the status of each app is read, if provided in the "status_file" property of the app.
The status files should be dynamically generated from another software (See https://github.com/Mairie-de-Saint-Maur/AppMonitor - statusFileGen).

### Ressources : img, css, font and webfonts
* img : contains the logos of the apps
* css : contains bootstrap and fontawesome CSS files. The main CSS is at the same level as the index.html file.
* font : contains glyphicons and metropolis font for styling
* webfonts : contains FontAwesome 5 files

/**** WARNING ****/
The logos and fonts in these folders are not free to use. Use your own, or opensource instead.
