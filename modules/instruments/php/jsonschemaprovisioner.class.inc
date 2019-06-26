<?php
/**
 * This file implements a data provisioner to get all possible
 * JsonSchema instances.
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

require_once 'jsonschema.class.inc';

/**
 * This class implements a data provisioner to get all possible
 * JsonSchema instances.
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
class JsonSchemaProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create an JsonSchemaProvisioner, which gets JsonSchema instances.
     */
    function __construct(?int $schemaid=null)
    {
        if ($schemaid===null) {
            parent::__construct(
                "SELECT i_s.InstrumentSchemaID AS schemaID,
                        i_s.SchemaHash AS schemaHash,
                        i_s.SchemaJson AS schemaJson,
                        i_s.PreviousVersion AS previousVersion,
                        i_s.DateUpdated AS dateUpdated,
                        u.Real_name AS updatedBy
                FROM instrument_schema i_s
                    LEFT JOIN users u
                    ON (i_s.UsersID=u.ID)",
                array()
            );
        } else {
            parent::__construct(
                "SELECT i_s.InstrumentSchemaID AS schemaID,
                        i_s.SchemaHash AS schemaHash,
                        i_s.SchemaJson AS schemaJson,
                        i_s.PreviousVersion AS previousVersion,
                        i_s.DateUpdated AS dateUpdated,
                        u.Real_name AS updatedBy
                FROM instrument_schema i_s
                    LEFT JOIN users u
                    ON (i_s.UsersID=u.ID)
                WHERE i_s.InstrumentSchemaID=:id",
                array('id' => $schemaid)
            );
        }
    }

    /**
     * Returns an instance of a JsonSchema object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this JsonSchema.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        $schemaID        = $row['schemaID'];
        $schemaHash      = $row['schemaHash'];
        $schemaJson      = $row['schemaJson'];
        $previousVersion = $row['previousVersion'];
        $dateUpdated     = $row['dateUpdated'];
        $updatedBy       = $row['updatedBy'];

        return new JsonSchema(
            $schemaID,
            $schemaHash,
            $schemaJson,
            $previousVersion,
            $dateUpdated,
            $updatedBy
        );
    }

   /**
     * Returns all rows that this provisioner provides, filtering them
     * for $user.
     *
     * @param \User $user The user who is attempting to load the data.
     *
     * @return \Traversable of DataInstance values of all the filtered data.
     */
    public function getRows(\User $user) : \Traversable
    {
        return $this->execute($user);
    }

    /**
     * Returns a PHP array which mirrors the format of toJSON (rather than
     * an array of data Instances, as getRows returns.)
     *
     * @param \User $user The user who is attempting to load the data.
     *
     * @return array an associative array representation of the data.
     */
    public function toArray(\User $user) : array
    {
        $allRows = $this->getRows($user);

        $results = [];
        foreach ($allRows as $row) {
            $results[] = json_decode($row->toJSON(), true);
        }
        return $results;
    }

    /**
     * Serializes this data to JSON for $user.
     *
     * @param \User $user The user who is attempting to load the data.
     *
     * @return string of valid JSON representing this data.
     */
    public function toJSON(\User $user) : string
    {
        return json_encode($this->toArray($user));
    }
}
