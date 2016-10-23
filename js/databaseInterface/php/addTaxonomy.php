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
        
        //echo json_encode($m);
        // public function addTaxonomy($taxonomy_rank_id, $parent_id, $scientific_name, $information, $characters_ids, $bibliographies_ids)
        $result = $taxonomy_database->addTaxonomy
        (
            $taxonomy['rank'],
            $taxonomy['parent_taxonomy_id'], 
            $taxonomy['name'], 
            $taxonomy['information'], 
            $taxonomy['characters'], 
            null 
        );

        echo $result;

    }

?>