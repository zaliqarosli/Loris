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

use \LORIS\instruments\JsonSchemaProvisioner;

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
     * Returns the \LORIS\instruments\JsonSchema object
     *
     * @return int this instrument's current schemaID
     */
    function getSchemaID(): int
    {
        $DB = \NDB_Factory::singleton()->database();

        $schemaID = $DB->pselectOne(
            "SELECT InstrumentSchemaID
                FROM test_names
                WHERE Test_name = :testName",
            array('testName' => $this->testName)
        );
        return $schemaID;
    }

    /**
     * Returns the \LORIS\instruments\JsonSchema object
     *
     * @return array
     */
    function getJsonSchemaEntity(): array
    {
        $user        = \User::singleton();
        $schemaID    = $this->getSchemaID();
        $provisioner = new JsonSchemaProvisioner($schemaID);

        return $provisioner->toArray($user);
    }

    function getSchemaURI(): string
    {
        $jsonschema = $this->getJsonSchemaEntity();
        $uri = $jsonschema['jsonSchema'];

        return $uri;
    }

    function getSchemaJSON(): string
    { 
        // open uri, expand schema with tool and convert to json string
        ini_set('allow_url_fopen', true);
        $jsonschema = file_get_contents($uri);
    }
}
