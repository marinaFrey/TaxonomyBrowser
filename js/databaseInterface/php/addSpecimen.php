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

        $taxonomy_database = new taxonomybrowser($hostname.':'.$db_port, $db_username, $db_password, $dbname);
        
		$m = null;
        $measures_list = $specimen['measures'];
		if($specimen['measures'])
		{
			foreach($measures_list as $measure)
			{
				$index = $measure['charId'];
				$m[$index]['character_type_id'] = $measure['charTypeId'];
				$m[$index]['value'] = $measure['value'];

			}
        }
        echo $specimen['user_id'];
		$result = $taxonomy_database->addSpecimenWithUserID
        (
            $specimen['taxonomy_id'], 
            null, 
            $specimen['collection_ID'], 
            $specimen['collected_by'], 
            $specimen['data'], 
            $specimen['latitude'], 
            $specimen['longitude'], 
            $specimen['information'], 
            null, 
            $m,
			$specimen['user_id']
        );
        /*
        $result = $taxonomy_database->addSpecimen
        (
            $specimen['taxonomy_id'], 
            null, 
            $specimen['collection_ID'], 
            $specimen['collected_by'], 
            $specimen['data'], 
            $specimen['latitude'], 
            $specimen['longitude'], 
            $specimen['information'], 
            null, 
            $m
        );*/

        echo $result;

    }

?>