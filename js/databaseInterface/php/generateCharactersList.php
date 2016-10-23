<?php
    
    include 'taxonomybrowser.class.php';
    
    if (isset($_POST['id'])) 
    {
        $hostname = 'localhost';
        $dbname = 'taxonomybrowser';
        $db_password = 'z8ta22j';
        $db_username = 'root';
        $db_port = 3306;
        $taxonomy_database = new taxonomybrowser($hostname.':'.$db_port, $db_username, $db_password, $dbname);
        
        
        $characters = $taxonomy_database->getCharactersWithAssociativeArray();
        
        $myfile = fopen("../../../data/characters.json", "w") or die("Unable to open file!");
        $txt = json_encode($characters);
        fwrite($myfile, $txt);
        fclose($myfile);
        
        echo "successfully created characters file";
        

    }

?>