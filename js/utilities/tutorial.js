function startIntro()
{
        var intro = introJs();
          intro.setOptions(
		  {
            steps: 
			[
				
			// sunburst
              {
                element: '#viz',
                intro: "This is the database's hirerarchy representation. <br><br>" +
						"Here you can <b>left click</b> to select specimens for viewing, <b>right click</b> to zoom in on a partition, and <b>hover</b> to manage taxons and add new information! <br><br>"+
						"In order to zoom out, right click the central circle."+
						"<video width='300' height='300' autoplay loop><source src='images/sunburst.mp4' type='video/mp4'>Your browser does not support the video tag.</video>",
						//"<p style='text-align:center;'><img src='images/gif_sunburst.gif' width='300' height='300' border='0' title='Specimens represented as little colored circles'></p> <br>",
				position: 'right'
              },
			  {
                element: '#taxtreeoptions',
                intro: "This is the menu for the taxonomy tree.",
				position: 'right'
              },
			  {
                element: '#byspecies',
                intro: "If you click this button, the size of each partition will be defined by the <b>number of SPECIES</b> registered in the database. This is the standard configuration.",
                position: 'bottom'
              },
              {
                element: '#byspecimen',
                intro: 'This button sets the size of each partition to be proportional to the <b>number of SPECIMENS</b> registered, which gives a good idea of how the database is currently populated.'+
						"<video width='300' height='300' autoplay loop><source src='images/troca_particao.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
				position: 'bottom'
              },
			// filtering  
			  {
                element: '#selected_view',
                intro: "In this section, every specimen selected on the hierarchy will appear as a little colored circle! <br>"+
						"<video width='300' height='300' autoplay loop><source src='images/bolinhas.mp4' type='video/mp4'>Your browser does not support the video tag.</video> <br>"+
						"The color of each circle represents its species color on the hierarchy visualization. You can <b>left click</b> any of them to show complete information from the specimen."+
						"If you <b>hover</b> the area, a tooltip will display the name of each species and how many are currently selected. You can also <b>drag</b> them around for fun!"+
						"<br><b>BUT</b>, if too many specimens are selected, clicking and dragging will be <b>disabled</b> in order to improve performance.",
                position: 'right'
              },
              {
                element: '#filteringoptions',
                intro: "This is where you can find options for operating on the selected specimens.",
                position: 'right'
              },
			  {
                element: '#analysis',
                intro: "If you click this button, a pop-up with information from all selected specimens will appear.Here you can, for example, get the <b> number of all selected (and filtered, if any filtering has been applied) specimens. </b>",
                position: 'bottom'
              },
			  {
                element: '#filterEditButton',
                intro: "When clicking this button, a pop-up for managing filters will appear. You can add as many filters as you want! <br><br>"+
						"After applying them, only the selected specimens that match your filters will be shown below. "+
						"<video width='300' height='300' autoplay loop><source src='images/filter.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              },
			  {
                element: '#export',
                intro: "By clicking here, every specimen below will be exported to a CSV file separated by semicolons, ready to be used on a variety of systems.",
                position: 'bottom'
              },
			// vizualizations
			  {
                element: '#right_viz',
                intro: "In this section we will show you visualizations for the selected specimens.",
                position: 'left'
              },
			  {
                element: '#vizoptions',
                intro: 'This is where you can select which visualization you want to see.',
                position: 'left'
              },
              {
                element: '#coord',
                intro: 'When clicking this button, the Parallel Coordenates visualization will be displayed. Every line shown can be clicked to display all information from the specimen!'+
				"<video width='300' height='300' autoplay loop><source src='images/coord.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              },
			  {
                element: '#dots',
                intro: 'When clicking this button, the Scatterplot visualization will be displayed. Every circle shown can be clicked to display all information from the specimen!'+
				"<video width='300' height='300' autoplay loop><source src='images/scatterplot.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              },
			  {
                element: '#map',
                intro: 'When clicking this button, a map with the locations of all specimens selected is displayed. Every circle shown can be clicked to display all information from the specimen!'+
				"<video width='300' height='300' autoplay loop><source src='images/mapa.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              }
			// toolbar - por algum motivo nao aparece o escrito direito...
			/*
			  {
                element: '#charactersManager',
                intro: 'If you are an Administrator user, you can manage all characteristics in here.',
                position: 'left'
              },
			  {
                element: '#loginButton',
                intro: 'Login or create a new account!',
                position: 'left'
              }*/
              
            ],
			
		tooltipPosition: 'auto',
		showProgress: true,
		width:  500
		//showBullets: false
		
          });

          intro.start();
}

function startHints()
{
	var intro = introJs();
          intro.setOptions(
		  {
            hints: 
			[
				{
                element: '#viz',
                hint: "This is the database's hirerarchy representation. <br><br>" +
						"Here you can <b>left click</b> to select specimens for viewing, <b>right click</b> to zoom in on a partition, and <b>hover</b> to manage taxons and add new information! <br><br>"+
						"In order to zoom out, right click the central circle."+
						"<video width='300' height='300' autoplay loop><source src='images/sunburst.mp4' type='video/mp4'>Your browser does not support the video tag.</video>",
						//"<p style='text-align:center;'><img src='images/gif_sunburst.gif' width='300' height='300' border='0' title='Specimens represented as little colored circles'></p> <br>",
				position: 'right'
              },
			  {
                element: '#byspecies',
                hint: "If you click this button, the size of each partition will be defined by the <b>number of SPECIES</b> registered in the database. This is the standard configuration.",
                position: 'bottom'
				
              },
              {
                element: '#byspecimen',
                hint: 'This button sets the size of each partition to be proportional to the <b>number of SPECIMENS</b> registered, which gives a good idea of how the database is currently populated.'+
						"<video width='300' height='300' autoplay loop><source src='images/troca_particao.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
				position: 'bottom'
              },
			// filtering  
			  {
                element: '#selected_view',
                hint: "In this section, every specimen selected on the hierarchy will appear as a little colored circle! <br>"+
						"<video width='300' height='300' autoplay loop><source src='images/bolinhas.mp4' type='video/mp4'>Your browser does not support the video tag.</video> <br>"+
						"The color of each circle represents its species color on the hierarchy visualization. You can <b>left click</b> any of them to show complete information from the specimen."+
						"If you <b>hover</b> the area, a tooltip will display the name of each species and how many are currently selected. You can also <b>drag</b> them around for fun!"+
						"<br><b>BUT</b>, if too many specimens are selected, clicking and dragging will be <b>disabled</b> in order to improve performance.",
                position: 'right'
              },
			  {
                element: '#analysis',
                hint: "If you click this button, a pop-up with information from all selected specimens will appear.Here you can, for example, get the <b> number of all selected (and filtered, if any filtering has been applied) specimens. </b>",
                position: 'bottom'
              },
			  {
                element: '#filterEditButton',
                hint: "When clicking this button, a pop-up for managing filters will appear. You can add as many filters as you want! <br><br>"+
						"After applying them, only the selected specimens that match your filters will be shown below. "+
						"<video width='300' height='300' autoplay loop><source src='images/filter.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              },
			  {
                element: '#export',
                hint: "By clicking here, every specimen below will be exported to a CSV file separated by semicolons, ready to be used on a variety of systems.",
                position: 'bottom'
              },
			// vizualizations
			  {
                element: '#right_viz',
                hint: "In this section we will show you visualizations for the selected specimens.",
                position: 'left'
              },
              {
                element: '#coord',
                hint: 'When clicking this button, the Parallel Coordenates visualization will be displayed. Every line shown can be clicked to display all information from the specimen!'+
				"<video width='300' height='300' autoplay loop><source src='images/coord.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              },
			  {
                element: '#dots',
                hint: 'When clicking this button, the Scatterplot visualization will be displayed. Every circle shown can be clicked to display all information from the specimen!'+
				"<video width='300' height='300' autoplay loop><source src='images/scatterplot.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              },
			  {
                element: '#map',
                hint: 'When clicking this button, a map with the locations of all specimens selected is displayed. Every circle shown can be clicked to display all information from the specimen!'+
				"<video width='300' height='300' autoplay loop><source src='images/mapa.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              }
			  /*
              {
                element: document.querySelector('#step1'),
                hint: "This is a tooltip.",
                hintPosition: 'top-middle'
              },
              {
                element: '#step2',
                hint: 'More features, more fun.',
                position: 'left'
              },
              {
                element: '#step4',
                hint: "<b>Another</b> step.",
                hintPosition: 'top-middle'
              }*/
            ]
          });
		  
          intro.onhintsadded(function() 
		  {
			var hintsButton = document.getElementById("hintsButton");
			var hintsButtonHide = document.getElementById("hintsButtonHide");
			
			//console.log(intro);
			
			if(hintsButton.style.display == "block")
			{
				
				hintsButton.style.display = "none";
				hintsButtonHide.style.display = "block";
			}
			else
			{
				hintsButton.style.display = "block";
				hintsButton.style.opacity = 0;
				hintsButtonHide.style.display = "none";
				
				
				
				intro.hideHints();
				//var hintsButtonHide = document.getElementById("hintsButtonHide");
			}
			//console.log('all hints added');
          });
          intro.onhintclick(function(hintElement, item, stepId) 
		  {
              //console.log('hint clicked', hintElement, item, stepId);
          });
          intro.onhintclose(function (stepId) 
		  {
              //console.log('hint closed', stepId);
          });
          intro.addHints();
		  
}

	  
	  