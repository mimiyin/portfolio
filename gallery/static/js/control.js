var gallery = gallery || {};
gallery.control = null;

(function (){
	
	
	var utils = gallery.utils;
	var control = {
		isZoomedOut : true,
		_currentMediumInd : 0,
		_currentProjectInd : 0,
		_currentProject : null,
		_media : [],	
		_projects : {},
		_sketches : [],
		_maxMediaCount : 0,
		init : function(media) {
			this._gallery = $("#gallery");
			this._sketches = $.extend([], Processing.instances);
			
			// Iterate through all the projects
			// Create a project object for each
			$.each(media, function(m, med){
				if(med.length > control._maxMediaCount)
					control._maxMediaCount = med.length;
				control._media.push([]);
			});
			
			$.each(media, function(m, med){			
				$.each(med, function(p, project){
					var newProject = new gallery.project(project, control._maxMediaCount/med.length);
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
			this._selector = $("#selector").delay(2500).fadeIn("slow");
			
			//Hook up nav items
			this._nav.find("#zoom-out").click(function() { control._zoomOut() });
			var thisCar = this;
			this._nav.find("#magic-eight-ball").click(function() { 
				var getRandomProject = function() {
					var randomProject = utils.getRandom(thisCar._projects);
					if(randomProject.code == control._currentProject.code)
						getRandomProject();
					else {
						return randomProject;
					}
				}
				
				control._zoomIn(getRandomProject()) 
				});
			
			this._nav.parent().mouseenter(function(){
				if(!control.isZoomedOut)
					control._showNav();
			});
			
			this._nav.parent().mouseleave(function(){
				if(!control.isZoomedOut)
					control._hideNav();
			});
						
			// Listen for window resize
			$(window).resize(function(){
				// Only resize what's open
				control._fitProjectsToWindow();
			});

			// Resize everything
			this._initSize();
						
			// Start out zoomed out
			this._zoomOut();			
		},
		
		// Gallery Map
		_zoomOut : function() {
			console.log("ZOOMING OUT");
			control.isZoomedOut = true;
			
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
				var transform = scale + " translate(" + translateX + "%, -100%)";
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
					var heightFactor = control._maxMediaCount/medium.length;
					$.each(medium, function(p, project){
						project.zoomOut(heightFactor);
						});					
					});	
		},
		
		// Show nav for 5 seconds after moving mouse
		_showNav : function(isAutoHide) {
			this._nav.stop(true, false);
			this._nav.slideDown("slow", function(){
				$(this).css("display", "block");
				if(isAutoHide)
					control._hideNav();
			})
		},
		
		// Hide nav
		_hideNav : function() {
			this._nav.delay(5000).slideUp("slow", function(){
				$(this).css("display", "none");
			});
		},
		
		// Open project
		_zoomIn : function(onProject) {
			console.log("ZOOMING IN ON: " + onProject.code);
			
			// If we were just zoomed out, refit the projects to window size
			if(this.isZoomedOut) {
				this._fitProjectsToWindow();
				$(".medium").switchClass("preview", "view", 0);
				$.each(this._projects, function(p, project){
					project.zoomIn(project.order);
				});			
			}

			// Calculate shift
			var leftShift = this._currentMediumInd - onProject.medium;
			var topShift =  this._currentProjectInd - onProject.order;	
			
			// Show nav after 2.5 seconds
			setTimeout(function(){
				control._showNav(true);
			}, 2500);
			
			// Shift the selector
			this._selector.shift(-leftShift, -topShift, 19.5, 33, 3000)


			// Open up this project
			// Close all others
			$.each(this._projects, function(p, project){
				// x-shift, y-shift, isSelected
				project.shift(leftShift, topShift, project.code == onProject.code);
			});			

			this._currentMediumInd = onProject.medium;
			this._currentProjectInd = onProject.order;
			this._currentProject = onProject;

			this.isZoomedOut = false;
		},
		
		// Runs only once at the beginning to size 
		// the divs and video according to the window
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