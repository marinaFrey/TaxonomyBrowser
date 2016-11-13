<?php


    class Hierarchy
    {
        function Hierarchy()
        {
            //$this->name = $sp['scientific_name'];
            //$this->measures = $m;
        }
        
        function setSpecimen($n,$sp)
        {
            $this->name = $n;
            $this->id = $sp['specimen_id'];
            $this->taxonomy_id = $sp['taxonomy_id'];
            $this->collection_id = $sp['collection_id'];
            $this->collected_by = $sp['collected_by'];
            $this->collected_data = $sp['collected_data'];
            $this->latitude = $sp['latitude'];
            $this->longitude = $sp['longitude'];
            //$this->altitude = $sp['altitude'];
            $this->information = $sp['information'];
			$this->user_name = $sp['user_name'];
			$this->group_name = $sp['group_name'];
            $this->selected = false;	
        }

        function setMeasures($m,$p)
        {
            $this->measures = array();
            foreach($m as $value)
            {
                //$temp = new Measure($p->getCharacter($value['character_id']),$value['value'],$p);
				
                //array_push($this->measures,array($value['character_id'] => $value['value']));
                $this->measures[$value['character_id']] = $value['value'];
            }
            
        }

        function setTaxonomy($tax)
        {
            $this->name = $tax['scientific_name'];
			$this->taxonomy_id = $tax['taxonomy_id'];
            $this->rank = $tax['taxonomy_rank_id'];
            $this->information = $tax['information'];
            $this->selected = false;
        }

        function setInheritedCharacters($chars,$p)
        {
            $this->inheritedCharacters = GenerateCharacterList($chars,$p);
        }
		
		function setCharacters($chars,$p)
		{
			$this->characters = GenerateCharacterList($chars,$p);
		}

        function setChildren($children)
        {
            $this->children = $children;
        }

    }

    class Measure
    {
        function Measure($char,$val,$p)
        {
            //$this->name = $char['character_name'];
            //$this->group= $p->getCharacterGroupName($char['character_group_id']);
            //$this->charTypeId = $char['character_type_id'];
            $this->charId = $char['character_id'];
            //$this->type = $p->getCharactersTypeName($char['character_type_id']);
            $this->value = $val;
            //$this->information = $char['information'];
        }
    }

    class Character
    {
        function Character($char,$p)
        {
            //$this->name = $char['character_name'];
            //$this->group = $p->getCharacterGroupName($char['character_group_id']);
            //$this->charTypeId = $char['character_type_id'];
            $this->charId = $char['character_id'];
            //$this->type = $p->getCharactersTypeName($char['character_type_id']);
            //$this->information = $char['information'];
        }
    }
    function GenerateCharacterList($charList,$p)
    {
        $list = array();
        
        foreach($charList as $char)
        {
            $temp =  $char['character_id'];//new Character($char,$p);
            if(!in_array($temp,$list))
            {
                array_push($list,$temp);	
            }
        }

        return $list;
    }



	function setHierarchy($father, $children, $pointer)
    {
        // checks if has children
        if(count($children)>0)
        {
            $list = array();
            foreach($children as $value)
            {
                
                //creates object
                $child = new Hierarchy();
                if($value['taxonomy_rank_id']== "7")
                {
                    $child->setTaxonomy($value);
                    $child->setInheritedCharacters($pointer->getAllCharactersFromTaxonomyNode($value['taxonomy_id']),$pointer);
                    $child->setCharacters($pointer->getCharactersFromTaxonomyNode($value['taxonomy_id']),$pointer);
                    $specimens_query_list = $pointer->getSpecimensByTaxonomyId($value['taxonomy_id']);
                    $sp_list = array();
                    foreach($specimens_query_list as $sp)
                    {
                        $specimen_h = new Hierarchy();
                        $specimen_h->setSpecimen($value['scientific_name'],$sp);
                        $specimen_h->setMeasures($pointer->getMeasures($sp['specimen_id']),$pointer);
                        array_push($sp_list,$specimen_h);
                    }
                    $child->setChildren($sp_list);
                }
                else
                {
                    $child->setTaxonomy($value);
					$child->setInheritedCharacters($pointer->getAllCharactersFromTaxonomyNode($value['taxonomy_id']),$pointer);
					$child->setCharacters($pointer->getCharactersFromTaxonomyNode($value['taxonomy_id']),$pointer);
                }
                $child_children = $pointer->getChilds($value['taxonomy_id']);
                setHierarchy($child,$child_children,$pointer);
                array_push($list,$child);	
            }
        
			$father->setCharacters($pointer->getCharactersFromTaxonomyNode($father->taxonomy_id),$pointer);
            $father->setChildren($list);
			
        }
        
    }
	
    function setHierarchyByUser($father, $children, $pointer, $user)
    {
        // checks if has children
        if(count($children)>0)
        {
            $list = array();
            foreach($children as $value)
            {
                
                //creates object
                $child = new Hierarchy();
                if($value['taxonomy_rank_id']== "7")
                {
                    $child->setTaxonomy($value);
                    $child->setInheritedCharacters($pointer->getAllCharactersFromTaxonomyNode($value['taxonomy_id']),$pointer);
                    $child->setCharacters($pointer->getCharactersFromTaxonomyNode($value['taxonomy_id']),$pointer);
                    $specimens_query_list = $pointer->getSpecimensByTaxonomyIdAndUserID($value['taxonomy_id'], $user);
                    $sp_list = array();
                    foreach($specimens_query_list as $sp)
                    {
                        $specimen_h = new Hierarchy();
                        $specimen_h->setSpecimen($value['scientific_name'],$sp);
                        $specimen_h->setMeasures($pointer->getMeasures($sp['specimen_id']),$pointer);
                        array_push($sp_list,$specimen_h);
                    }
                    $child->setChildren($sp_list);
                }
                else
                {
                    $child->setTaxonomy($value);
					$child->setInheritedCharacters($pointer->getAllCharactersFromTaxonomyNode($value['taxonomy_id']),$pointer);
					$child->setCharacters($pointer->getCharactersFromTaxonomyNode($value['taxonomy_id']),$pointer);
                }
                $child_children = $pointer->getChilds($value['taxonomy_id']);
                setHierarchyByUser($child,$child_children,$pointer, $user);
                array_push($list,$child);	
            }
        
			$father->setCharacters($pointer->getCharactersFromTaxonomyNode($father->taxonomy_id),$pointer);
            $father->setChildren($list);
			
        }
        
    }
?>