<?php
/**
 * This class implements a data Instance which represents a single
 * row in the instrument_builder menu table.
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
 * An InstrumentRow represents a row in the Instrument Builder  menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class InstrumentRow implements \LORIS\Data\DataInstance
{
    protected $DBRow;

    /**
     * Create a new InstrumentRow
     *
     * @param array   $row The row (in the same format as \Database::pselectRow
     *
     * @return void
     */
    public function __construct(array $row)
    {
        $this->DBRow    = $row;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the row data.
     */
    public function toJSON() : string
    {
        return json_encode($this->DBRow);
    }
}
