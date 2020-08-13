<?php
/**
 * This file implements a data provisioner to get all possible rows
 * for the instrument_builder menu page.
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
 * This class implements a data provisioner to get all possible rows
 * for the instrument_builder menu page.
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
class InstrumentRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create an InstrumentRowProvisioner, which gets rows for the instrument_builder menu table.
     */
    function __construct()
    {
        // TODO: update description to be meaningful
        parent::__construct(
            "SELECT ib.InstrumentBuilderID as id,
                    ib.Name as name,
                    ib.Description AS description,
                    ib.DateUpdated AS dateUpdated,
                    u.Real_name AS updatedBy,
                    ib.SchemaJSON AS schemaJson
            FROM instrument_builder ib
                LEFT JOIN users u ON
                    (u.ID=ib.UsersID)",
            array()
        );
    }

    /**
     * Returns an instance of an InstrumentRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new InstrumentRow($row);
    }
}
