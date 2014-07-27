var gallery = gallery || {};
gallery.control = null;

(function (){
	
	
	var utils = gallery.utils;

	var control = {
		projects : {},
		init : function(media) {
			this.element = $('#gallery');
			
			// Iterate through all the projects
			// Create a project object for each
			$.each(media, function(m, med){		
				$.each(med, function(p, proj){
					var project = control.element.find("ul[code=" + proj.code + "]").project({
						code : proj.code,
						medium : proj.medium,
						order : proj.order,
					}).data("doc-project");

					control.projects[proj.code] = project;

					// First project
					if(m == 0 && p == 0) {
						control.currentProject = project;
					}
				});
			});	

			// Initiate nav
			this.nav = $("#nav").nav({
				selected : function(event, code) {
					control._move(control._getProject(code));
				}
			});

			// Start with top-left
			this._currentProject = this._getProject('multiverse');
			
			// Start out with about
			this.nav.nav('select',  window.location.hash.replace("#", "") || 'about');					
		},

		_getProject : function(code) {
			return this.projects[code];
		},

		// Open project
		_move : function(project) {
			console.log("MOVING TO", project.options.code);

			if(this.currentProject.options.code == project.options.code) {
				return;
			}

			// Calculate shift for Project
			var leftShift = project.options.medium;
			var topShift =  project.options.order;

			console.log("SHIFT", leftShift, topShift);

			this.element.shift(-leftShift, -topShift, 100, 100, 2500);
			
			project.select();

			//Deselect the other projects
			$.each(this.projects, function(p, proj) {
				if(p == control.currentProject.options.code) {
					proj.deselect();
				}
			});

			// Update current project
			this.currentProject = project;
		}				
	}	
	
	gallery.control = control;

}());