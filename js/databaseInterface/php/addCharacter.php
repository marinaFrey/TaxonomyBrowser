<?php
    
    include 'taxonomybrowser.class.php';
    
    if (isset($_POST['id'])) 
    {
    
        $character = $_POST['id'];

        $hostname = 'localhost';
        $dbname = 'taxonomybrowser';
        $db_password = 'z8ta22j';
        $db_username = 'root';
        $db_port = 3306;

        $taxonomy_database = new taxonomybrowser($hostname.':'.$db_port, $db_username, $db_password, $dbname);

        //echo json_encode($m);
        // addCharacter($character_name, $information, $character_group_id, $character_type_id, $unit_id, $character_enums)
        $result = $taxonomy_database->addCharacter
        (
            $character['character_name'],
            $character['information'], 
            $character['character_group_id'], 
            $character['character_type_id'], 
            $character['unit_id'], 
            null 
        );

        echo $result;

    }

?>