<?php
    
    include 'taxonomybrowser.class.php';
    
    if (isset($_POST['id'])) 
    {
    
        $taxonomy = $_POST['id'];
    
        $hostname = 'localhost';
        $dbname = 'taxonomybrowser';
        $db_password = 'z8ta22j';
        $db_username = 'root';
        $db_port = 3306;

        $taxonomy_database = new taxonomybrowser($hostname.':'.$db_port, $db_username, $db_password, $dbname);
        
        $ranks = $taxonomy_database->getTaxonomyRanksWithAssociativeArray();
		
		echo json_encode($ranks);
		
		/*
		$myfile = fopen("../../../data/ranks.json", "w") or die("Unable to open file!");
        $txt = json_encode($ranks);
        fwrite($myfile, $txt);
        fclose($myfile);
        
        echo "successfully created ranks file";*/

    }

?>