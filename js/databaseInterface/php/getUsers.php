<?php
    
    include 'taxonomybrowser.class.php';
    
    if (isset($_POST['id'])) 
    {
    
        $user = $_POST['id'];
    
        $hostname = 'localhost';
        $dbname = 'taxonomybrowser';
        $db_password = 'z8ta22j';
        $db_username = 'root';
        $db_port = 3306;

        $taxonomy_database = new taxonomybrowser($hostname.':'.$db_port, $db_username, $db_password, $dbname);
        
		$result2 = $taxonomy_database->getUsers();
		
		echo json_encode($result2);


        //echo $result;

    }

?>