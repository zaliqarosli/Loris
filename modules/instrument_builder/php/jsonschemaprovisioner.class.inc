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

namespace LORIS\instrument_builder;

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
    function __construct()
    {
        //note that this needs to be in the same order as the headers array
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
}
