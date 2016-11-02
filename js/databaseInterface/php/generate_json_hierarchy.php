
<?php

    include 'taxonomybrowser.class.php';
    include 'hierarchy_new.php';
    
    if (isset($_POST['id'])) 
    {
		$user = $_POST['id'];
		
        $hostname = 'localhost';
        $dbname = 'taxonomybrowser';
        $db_password = 'z8ta22j';
        $db_username = 'root';
        $db_port = 3306;
        $taxonomy_database = new taxonomybrowser($hostname.':'.$db_port, $db_username, $db_password, $dbname);
        
        $root_tax = $taxonomy_database->getTaxonomyNodeRoot();
        $r = new Hierarchy();
        $r->setTaxonomy($root_tax);
        $c = $taxonomy_database->getChilds($root_tax['taxonomy_id']);
        
		if( $user['user_role'] == "2")
			setHierarchyByUser($r,$c,$taxonomy_database, $user['user_id']);
		else
			setHierarchy($r,$c,$taxonomy_database);
        
        
        $myfile = fopen("../../../data/data2.json", "w") or die("Unable to open file!");
        $txt = json_encode($r);
        fwrite($myfile, $txt);
        fclose($myfile);
        
        echo "success";

    }
?>
