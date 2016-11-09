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
						"Here you can left click to zoom in on a partition, right click to select specimens for viewing and hover to manage taxons and add new information! <br><br>"+
						"In order to zoom out, left click the central circle."+
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
                intro: "If you click this button, the size of each partition will be defined by the number of SPECIES registered in the database.",
                position: 'bottom'
              },
              {
                element: '#byspecimen',
                intro: 'This button sets the size of each partition to be proportional to the number of SPECIMENS registered, which gives a good idea of how the database is currently populated.'+
						"<video width='300' height='300' autoplay loop><source src='images/troca_particao.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
				position: 'bottom'
              },
			// filtering  
			  {
                element: '#selected_view',
                intro: "In this section, every specimen selected on the hierarchy will appear as a little colored circle! <br>"+
						"<video width='300' height='300' autoplay loop><source src='images/bolinhas.mp4' type='video/mp4'>Your browser does not support the video tag.</video> <br>"+
						"The color of each circle represents its species color on the hierarchy visualization.",
                position: 'right'
              },
              {
                element: '#filteringoptions',
                intro: "This is where options for operating on the selected specimens stay.",
                position: 'right'
              },
			  {
                element: '#analysis',
                intro: "If you click this button, a pop-up with information from the selected specimens will appear.",
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
                intro: "By clicking here, every specimen below will be exported on a CSV file separated by semicolons, ready to be used on a variety of systems.",
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
                intro: 'When clicking this button, the Parallel Coordenates visualization will be shown.'+
				"<video width='300' height='300' autoplay loop><source src='images/coord.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              },
			  {
                element: '#dots',
                intro: 'When clicking this button, the Scatterplot visualization will be shown.'+
				"<video width='300' height='300' autoplay loop><source src='images/scatterplot.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              },
			  {
                element: '#map',
                intro: 'When clicking this button, a map with the locations of all specimens selected.'+
				"<video width='300' height='300' autoplay loop><source src='images/mapa.mp4' type='video/mp4'>Your browser does not support the video tag.</video> ",
                position: 'bottom'
              },
			// toolbar - por algum motivo nao aparece o escrito direito...
			  {
                element: '#charactersManager',
                intro: 'If you are an Administrator user, you can manage all characteristics in here.',
                position: 'left'
              },
			  {
                element: '#loginButton',
                intro: 'Login or create a new account!',
                position: 'left'
              }
              
            ],
			
		showProgress: true
		//showBullets: false
		
          });

          intro.start();
      }
	  
	  