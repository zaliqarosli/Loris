<?php
/**
 * This class implements a data Instance which represents a single
 * JSON Schema entity.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\instruments;

/**
 * An JsonSchema represents a JSON schema for an instrument.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class JsonSchema implements \LORIS\Data\DataInstance
{
    /**
     * Variables for properties that describe a JSON schema instance
     *
     * @var int     $schemaID
     * @var string  $shortName
     * @var string  $fullName
     * @var Hash    $schemaHash
     * @var string  $schemaJson
     * @var int     $previousVersion
     * @var string  $dateUpdated
     * @var string  $updatedBy
     */
    private $schemaID;
    private $schemaHash;
    private $schemaJson;
    private $previousVersion;
    private $dateUpdated;
    private $updatedBy;

    /**
     * Create a new JsonSchema
     *
     * @return void
     */
    public function __construct(
        int     $schemaID,
        string  $schemaHash, // TODO: change to \Hash
        string  $schemaJson,
        ?int    $previousVersion=null,
        string  $dateUpdated,
        string  $updatedBy
    ) {
        $this->schemaID        = $schemaID;
        $this->schemaHash      = $schemaHash;
        $this->schemaJson      = $schemaJson;
        $this->previousVersion = $previousVersion;
        $this->dateUpdated     = $dateUpdated;
        $this->updatedBy       = $updatedBy;
    }

    /**
     * Packages properties into an array
     *
     * @return array the array of properties
     */
    public function toArray() : array
    {
        $arr = array(
                'schemaID'        => $this->schemaID,
                'schemaHash'      => $this->schemaHash,
                'schemaJson'      => $this->schemaJson,
                'previousVersion' => $this->previousVersion,
                'dateUpdated'     => $this->dateUpdated,
                'updatedBy'       => $this->updatedBy,
               );

        return $arr;
    }
    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the row data.
     */
    public function toJSON() : string
    {
        return json_encode($this->toArray());
    }
}
