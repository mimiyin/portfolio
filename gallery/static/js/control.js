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
					var project = control.element.find("#" + proj.code).project({
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
			this.nav = $("#nav-wrapper").nav({
				selected : function(event, ui) {
					var code = ui;
					control._move($this._getProject(code));
				}
			});

			// Start out with about
			this._move(control._getProject("about"));			
		},

		_getProject : function(code) {
			return this.projects[code];
		},

		// Open project
		_move : function(project) {
			console.log("MOVING TO: " + project.options.code);

			if(this.currentProject.options.code == project.options.code) {
				return;
			}

			// Calculate shift for Project
			var leftShift = (this.currentProject.options.medium || 0) - project.medium;
			var topShift =  (this.currentProject.options.order || 0) - project.order;

			// Update current project
			this.currentProject = project;

			// Move the entire gallery
			this.element.shift(leftShift, topShift, 100, 100, 'vh', 2500);

			// Deselect the other projects
			$.each(this.projects, function(p, proj) {
				if(p == project.code) {
					// Select the project
					project.select();					
				}
				else {
					project.deselect();
				}
			});
		}				
	}	
	
	gallery.control = control;

}());