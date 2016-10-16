<?php
    
    include 'taxonomybrowser.class.php';
    
    if (isset($_POST['id'])) 
    {
    
        $specimen = $_POST['id'];
    
        $hostname = 'localhost';
        $dbname = 'taxonomybrowser';
        $db_password = 'z8ta22j';
        $db_username = 'root';
        $db_port = 3306;
        //$registry = new registry;
        $taxonomy_database = new taxonomybrowser($hostname.':'.$db_port, $db_username, $db_password, $dbname);
        $value = $taxonomy_database->getMeasures($specimen['id']);
        //$value = $taxonomy_database->getSpecimens();
    
        
        echo json_encode($value);
        
        //echo $specimen['name'];
        //$obj = json_decode($variable);
        //echo $obj->{'id'};
        
        //echo json_encode($_POST['id']);
        //deleteClient11($_POST['id']);

        //function deleteClient11($x) 
        //{
           // your business logic
        //}

    }

?>