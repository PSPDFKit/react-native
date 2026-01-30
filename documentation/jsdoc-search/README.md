JSDoc Search Plugin
-------------------

Usage:
======

* Download all the files
* Update your JSDoc configuration file (e.g. `conf.json`) to include the plugin and configure the templates.

		{
		    "plugins": ["./search/search"],
		    "templates": {
		        "default": {
		            "layoutFile": "./search/layout.tmpl",
		            "staticFiles": {
		                "include": [
		                    "./search/statics"
		                ]
		            }
		        }
		    }
		}

If you are using a custom layout, you can copy the appropriate changes from `layout.tmpl` to your layout.
