var gallery = gallery || {};
gallery.control = null;

(function (){
	var utils = gallery.utils;
	var control = {
		isZoomedOut : false,
		_currentMediumInd : 0,
		_currentProjectInd : 0,
		_currentProject : null,
		_media : [],	
		_projects : {},
		_sketches : [],
		_maxMediaCount : 0,
		init : function(media) {
			this._sketches = $.extend([], Processing.instances);
			
			// Iterate through all the projects
			// Create a project object for each
			$.each(media, function(m, med){
				if(med.length > control._maxMediaCount)
					control._maxMediaCount = med.length;
				control._media.push([]);
				$.each(med, function(p, project){
					var newProject = new gallery.project(project, 1/med.length);
					control._media[m].push(newProject);
					control._projects[project.code] = newProject;
										
					//Add click listener for each project on project div
					newProject.div.click( newProject, function(e){ 
						if(control.isZoomedOut) {
							console.log(e.data);
							control._zoomIn(e.data); 
							}
						});
					// And project nav item
					newProject.navItem.click( newProject, function(e){ 
						control._zoomIn(e.data); });
				});
			});	
			
			this._nav = $("#nav");
			//Hook up nav items
			this._nav.find("#zoom-out").click(function() { control._zoomOut() });
			var thisCar = this;
			console.log(utils.getRandom(thisCar._projects));
			this._nav.find("#magic-eight-ball").click(function() { 
				var getRandomProject = function() {
					var randomProject = utils.getRandom(thisCar._projects);
					console.log(randomProject.code);
					if(randomProject.code == control._currentProject.code)
						getRandomProject();
					else
						return randomProject;
				}
				
				control._zoomIn(getRandomProject()) 
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
				control._fitProjectsToWindow();
				if(control.isZoomedOut)
					control._zoomOut(true);
			});

			// Resize everything
			this._initSize();
						
			// Start out zoomed out
			this._zoomeOut();			
		},
		
		// Gallery Map
		_zoomOut : function(isResizing) {
			console.log("ZOOMING OUT");
			this._nav.slideUp("fast");
			this._currentMediumInd = 0;
			this._currentProjectInd = 0;
			var media = $(".medium");
			var numMedium = media.length;
			var scaleX = 1/numMedium;
			$.each(media, function(m, med){
				var mediumEl = $(med);
				var scale = "scale(" + scaleX + "," + scaleX + ")";
				var translateX = -150 + m*400;
				var transform = scale + " translate(" + translateX + "%, -150%)";
				mediumEl
					.switchClass("view", "preview", 1000)
					.css({
						"transform" : transform,
						"-moz-transform" : transform,
						"-webkit-transform" : transform,
						});
					// Grab the projects for this medium
					var medium = control._media[m];
					// Scale the height relative to medium with maxNum of projects
					var height = $(window).height()*control._maxMediaCount/medium.length;
					$.each(medium, function(p, project){
						project.zoomOut(height);
						if(!isResizing)
							project.start();
						});					
				});			
			control.isZoomedOut = true;
		},
		
		// Open project
		_zoomIn : function(onProject) {
			console.log("ZOOMING IN ON: " + onProject.code);
			
			// If we were just zoomed, refit the projects to window size
			if(this.isZoomedOut)
				this._fitProjectsToWindow();

			this._nav.delay(2500).slideDown("slow");
			
			// Calculate shift
			var leftShift = this._currentMediumInd - onProject.medium;
			var topShift =  this._currentProjectInd - onProject.order;	
			
			// Open up this project
			// Close all others
			var thisProject = this;
			$.each(this._projects, function(p, project){
				// x-shift, y-shift, isSelected
				project.shift(leftShift, topShift, project.code == onProject.code);
			});			

			$(".medium").switchClass("preview", "view", 500);
			this._currentMediumInd = onProject.medium;
			this._currentProjectInd = onProject.order;
			this._currentProject = onProject;

			this.isZoomedOut = false;
		},
		
		_initSize : function(){				
			this._fitProjectsToWindow();
			
			// Dynamically size vimeo videos
			$(".vimeo").height($(".vimeo").width()*.562);
		},

		// Resize everything to window
		_fitProjectsToWindow : function() {
			$("#gallery").height($(window).height());

			$.each(this._projects, function(p, project){
				project.fitToWindow();
			});
		}
	}	
	
	gallery.control = control;

}());