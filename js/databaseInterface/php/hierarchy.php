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
            $this->selected = false;	
        }

        function setMeasures($m,$p)
        {
            $this->measures = array();
            foreach($m as $value)
            {
                $temp = new Measure($p->getCharacter($value['character_id']),$value['value'],$p);
                array_push($this->measures,$temp);
            }
            
        }

        function setTaxonomy($tax)
        {
            $this->name = $tax['scientific_name'];
            $this->rank = $tax['taxonomy_rank_id'];
            $this->information = $tax['information'];
            $this->selected = false;
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
            $this->name = $char['character_name'];
            $this->group= $p->getCharacterGroupName($char['character_group_id']);
            $this->charTypeId = $char['character_type_id'];
            $this->charId = $char['character_id'];
            $this->type = $p->getCharactersTypeName($char['character_type_id']);
            $this->value = $val;
            $this->information = $char['information'];
        }
    }

    class Character
    {
        function Character($char,$p)
        {
            $this->name = $char['character_name'];
            $this->group = $p->getCharacterGroupName($char['character_group_id']);
            $this->charTypeId = $char['character_type_id'];
            $this->charId = $char['character_id'];
            $this->type = $p->getCharactersTypeName($char['character_type_id']);
            $this->information = $char['information'];
        }
    }
    function GenerateCharacterList($charList,$p)
    {
        $list = array();
        
        foreach($charList as $char)
        {
            $temp = new Character($char,$p);
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
                    $child->setCharacters($pointer->getAllCharactersFromTaxonomyNode($value['taxonomy_id']),$pointer);
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
                }
                $child_children = $pointer->getChilds($value['taxonomy_id']);
                setHierarchy($child,$child_children,$pointer);
                array_push($list,$child);	
            }
        
            $father->setChildren($list);
        }
        
    }
?>