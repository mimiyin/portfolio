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
				});
			});	

			// Initiate nav
			this._nav = gallery.nav.init($("#nav-wrapper"));

			// Move to a specific project
			$(this._nav).on("move", function(event, code){
				control._move(control._getProject(code));
			});

			// Get random project
			$(this._nav).on("random", function(){
				control._move(control._getRandomProject());
			});

			this.currentProject = this._getProject('multiverse');

			// Start out zoomed out
			this._move(this._getProject('beluga'));			
		},

		// Get specific project
		_getProject : function(code) {
			return this._projects[code];
		},

		// Get random project
		_getRandomProject : function() {
			var randomProject = utils.getRandom(control._projects);
			if(randomProject.code == control._currentProject.code)
				control.getRandomProject();
			else {
				return randomProject;
			}
		},

		// Open project
		_move : function(project) {
			console.log("MOVING TO: " + project.code);

			if(this.currentProject.code == project.code) {
				return;
			}

			// Calculate shift for Project
			var leftShift = this.currentProject.medium - project.medium;
			var topShift =  this.currentProject.order - project.order;

			// Update current project
			this.currentProject = project;

			console.log("SHIFT", leftShift, topShift);
					
			// Move the entire gallery
			this._element.shift(leftShift, topShift, 100, 100, 'vh', 2500);

			// Emit zoom in event 
			$(this).trigger('move', { left : leftShift, top: topShift });
		}				
	}	
	
	gallery.control = control;

}());