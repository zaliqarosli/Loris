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
            "SELECT i_s.InstrumentSchemaID AS id,
                    tn.Full_name AS name,
                    tn.Full_name AS description,
                    i_s.DateUpdated AS dateUpdated,
                    u.Real_name AS updatedBy
            FROM test_names tn
                LEFT JOIN instrument_schema i_s USING
                    (InstrumentSchemaID)
                LEFT JOIN users u ON
                    (u.ID=i_s.UsersID)
            WHERE tn.InstrumentSchemaID IS NOT NULL",
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
