var gallery = gallery || {};
gallery.control = null;

(function (){
	
	
	var utils = gallery.utils;

	var control = {
		isZoomedOut : true,
		_currentMediumInd : 0,
		_currentProjectInd : 0,
		_currentMediumIndNav : 4,
		_currentProjectIndNav : 0,
		_currentProject : null,
		_media : [],	
		_projects : {},
		_sketches : [],
		_maxMediaCount : 0,
		init : function(media) {

			this._element = $('#gallery');
			this._sketches = $.extend([], Processing.instances);
			
			// Iterate through all the projects
			// Create a project object for each
			$.each(media, function(m, med){		
				control._media.push([]);
				$.each(med, function(p, project){
					var p = new gallery.project(project);
					control._media[m].push(p);
					control._projects[project.code] = p;
					
					// Listen for nav clicks to zoon in on selected project
					$(p).on('click', function(){
						control._zoomIn(p);
					});
				});
			});	

			// Create nav item
			this._nav = $(gallery.nav.init($('#nav')));

			// Zoom in project
			this._nav.on('click', function(p){
				control.zoomIn(control_projects[p]);
			});	

			// Zoom out
			this._nav.on('zoomOut', function(){
				control._zoomOut();
			});

			// Start out zoomed out
			this._zoomOut();			
		},

		// Get random project
		getRandomProject : function() {
			var randomProject = utils.getRandom(control._projects);
			if(randomProject.code == control._currentProject.code)
				control.getRandomProject();
			else {
				return randomProject;
			}
		},

		// Clear zoom status on all projects
		_clearZoom : function() {
			$.each(this._projects, function(p, project){
				project.isZoomedIn = false;
			});
		},
				
		// Gallery Map
		_zoomOut : function() {
			//console.log("ZOOMING OUT");
			this._element.toggleClass("zoomedOut", true, "slow");

			// Reset what's "current"
			this._currentProject = null;
			this._currentMediumInd = 0;
			this._currentProjectInd = 0;
			this._clearZoom();

			control.isZoomedOut = true;

			// Tell everyone we've zoomed out
			$(this).trigger('zoomOut');
		},

		// Open project
		_zoomIn : function(zoomProject) {
			console.log("ZOOMING IN ON: " + zoomProject.code);

			// Don't bother if we're already here
			if(zoomProject.isZoomedIn) {
				return;
			}

			//Make it true if it wasn't already
			this._clearZoom();
			zoomProject.isZoomedIn = true;

			// Toggle class if changing class
			if(control.isZoomedOut) {
				this._element.toggleClass("zoomedOut", false, "slow");
			}

			// Calculate shift for Project
			var leftShift = this._currentMediumInd - zoomProject.medium;
			var topShift =  this._currentProjectInd - zoomProject.order;
					
			// Emit zoom in event 
			$(this).trigger('zoomIn', { left: leftShift, top: topShift });

			// Update what's current
			this._currentMediumInd = zoomProject.medium;
			this._currentProjectInd = zoomProject.order;

			this.isZoomedOut = false;

			// Emit shift event
			$(this).trigger('shift', { top : topShift, left : leftShift});
		}				
	}	
	
	gallery.control = control;

}());