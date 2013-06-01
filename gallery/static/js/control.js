var gallery = gallery || {};
gallery.control = null;

(function (){
	var control = {
		_isZoomedOut : false,
		_currentMedium : null,
		_currentProject : null,
		_media : [],	
		_projects : {},
		_sketches : [],
		init : function(media) {
			this._sketches = $.extend([], Processing.instances);

			// Iterate through all the projects
			// Create a project object for each
			$.each(media, function(m, med){
				control._media.push([]);
				$.each(med, function(p, project){
					var newProject = new gallery.project(project, 1/med.length);
					control._media[m].push(project);
					control._projects[project.code] = newProject;
					
					//Add click listener for each project on project div
					newProject.div.click( newProject, function(e){ 
						if(control._isZoomedOut) {
							//control._zoomIn(e.data); 
							}
						});
					// And project nav item
					newProject.navItem.click(newProject, function(e){ control._zoomIn(e.data); });
				});
			});	
			
			// When scrolled to project edge, open adjacent project
/* 			$(window).scroll(function(){
				var nextProject = null;
				
				if ($(window).scrollBottom() < 0) {
					nextProject = control._media[control._currentMedium][control._currentProject.order + 1];
				}
				else if ($(window).scrollTop() < 0) {
					nextProject = control._media[control._currentMedium][control._currentProject.order - 1];
				}
				else if($(window).scrollRight() < 0) {
					nextProject = control._media[control._currentMedium + 1][control._currentProject.order];
				}
				else if($(window).scrollLeft() < 0) {
					nextProject = control._media[control._currentMedium - 1][control._currentProject.order];					
				}
				if(nextProject)
					this._zoomIn(nextProject);
			}); */
			
			// Listen for window resize
			$(window).resize(function(){
				// Only resize what's open
				//control._resize();
			});
			
			// Dynamically size vimeo videos
			$(".vimeo").height($(".vimeo").width()*.562);
						
			// Start out zoomed out
			this._zoomOut();
			
			// Resize everything
			this._resizeAll();
		},
		
		_zoomOut : function() {
			console.log("ZOOMING OUT");
//			$("#gallery").toggleClass("preview", true, 1000);
//			$.each(this._projects, function(p, project){
//				project.zoomOut();
//			});
			control._isZoomedOut = true;
		},
		_zoomIn : function(onProject) {
			console.log("ZOOMING IN");
			$("#gallery").toggleClass("preview", false, 500);
			this._currentMedium = onProject.medium;
			this._currentProject = onProject;
			
			// Open up this project
			// Close all others
			$.each(this._projects, function(p, project){
				if(p == onProject.code) {
					project.open();
					project.start();	
				}
				else {
					project.stop();
					project.close();
				}
			});			
			control._isZoomedOut = false;
		},
		
		_resizeAll : function(){	
			// Resize everything
			$.each(this._projects, function(p, project){
				project.resize();
			});
			$.each(this._sketches, function(s, sketch){
				var size = sketch.getSize();
				var width = size.x;
				var height = size.y;
 				var scaleX = $(window).width()/width || 0;
				sketch.resize(scaleX, 1);
 			});				
		}	
	}	
	
	gallery.control = control;

}());