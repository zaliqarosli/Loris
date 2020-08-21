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
 * An InstrumentRow represents a row in the Instrument Builder menu table.
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
    protected $SchemaJSON;

    /**
     * Create a new Instrument Row Instance.
     *
     * @param array $row The Instrument Row Instance
     */
    public function __construct(array $row, string $schemaJSON)
    {
        $this->DBRow = $row;
        $this->SchemaJSON = $schemaJSON;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the instance data.
     */
    public function toJSON(): string
    {
        return json_encode($this->DBRow);
    }

    /**
     * Returns the SchemaJSON for this row.
     *
     * @return string The instrument JSON schema
     */
    public function getSchemaJSON(): string
    {
        return $this->SchemaJSON;
    }
}
