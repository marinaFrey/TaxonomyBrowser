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
        
		//removeUser($user_id)
		$result2 = $taxonomy_database->removeUser($user['id']);
		
		echo json_encode($result2);


        //echo $result;

    }

?>