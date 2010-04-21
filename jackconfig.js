/**
 * The starting point for Pintura running as a Jack app.
 */
try{
	var pintura = require("pintura/pintura");
}catch(e){
	// old loaders need to use this type of access, pintura will fix things from there 
	pintura = require("pintura");
}

var File = require("file"),
	transporter = require("pintura/jsgi/transporter");

require("app");

// setup the Jack application
exports.app =
	// this will provide module wrapping for the server side CommonJS libraries for the client
	transporter.Transporter({}, 
		// make the root url redirect to /Page/Root  
		require("pintura/jsgi/redirect-root").RedirectRoot(
		 	// main Pintura handler 
			pintura.app
		)
	);

// now setup the development environment, handle static files before reloading the app
// for better performance
exports.development = function(app, options){
	return require("jack/cascade").Cascade([
			// cascade from static to pintura REST handling
/*		// this will provide module wrapping for the Dojo modules for the client
		transporter.Transporter({
			urlPrefix:"/js/",
			paths:["../../persevere/public/js/"],
			converter: transporter.Dojo
		}),*/
		// the main place for static files accessible from the web
		require("jack/static").Static(null, {urls:[""],root:"public"}),
		// the typical reloader scenario
		(!options || options.reload) ? require("jack/reloader").Reloader(File.join(File.cwd(), "jackconfig"), "app") :
								exports.app
	]);
};

// we start the REPL (the interactive JS console) because it is really helpful
new (require("worker").SharedWorker)("narwhal/repl");

