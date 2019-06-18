<?php declare(strict_types=1);
/**
 * This file contains the base class for JSON instruments in Loris
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Instruments
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

namespace Loris\Behavioural;

/**
 * JSON Instrument subclass of Instrument Instance
 *
 * @category Main
 * @package  Instruments
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
use \LORIS\Data\DataInstance;

class NDB_BVL_Instrument_JSON extends \NDB_BVL_Instrument
{
    protected $jsonData = true;

    var $InstrumentType = 'JSON';

    var $instrumentFields = array();

    /**
     * True if the page is being previewed from the instrument builder
     * or viewer, and not really loaded.
     */
    var $preview = false;

    /**
     * Sets up the variables required for a JSON instrument to load
     *
     * @param string|null $commentID The CommentID being loaded
     * @param string|null $page      The page being loaded
     *
     * @return void
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->commentID = $commentID;
        $this->page      = $page;
    }

    /**
     * Return the full, human readable name for the
     * current instrument.
     *
     * @return string the full name of the instrument
     */
    public function getFullName(): string
    {
        $jsonschema = $this->getJSONSchema();
        
        return $jsonschema['skos:prefLabel'];
    }

    /**
     * Returns a list of subtests of the current instrument.
     * The returned array should be a list of rows where each
     * row has a key for "Name" (the subpage name) and "Description"
     * (the human readable name)
     *
     * @return array
     */
    function getSubtestList(): array
    {
        $jsonschema = $this->getJSONSchema();
        
        // return schema['order'] where type=page plus ['description']
        return $jsonschema['ui']['order'];
    }

    /**
     * Returns the schema JSON object
     *
     * @return array
     */
    function getJSONSchema(): array
    {
        $DB = \NDB_Factory::singleton()->database();

        $query = "SELECT is.InstrumentSchemaID
                    FROM instrument_schema is
                    LEFT JOIN test_names tn
                    USING (InstrumentSchemaID)
                    WHERE tn.Test_name = :instrument";
        $param = array('instrument' => $this->testName);

        $uri = $DB->pselect($query, $param);

        ini_set('allow_url_fopen', true);
        $jsonschema = file_get_contents($uri);

        // need to expand schema
    }

}


