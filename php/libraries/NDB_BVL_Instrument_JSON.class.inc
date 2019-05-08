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

        // $this->form = new \LorisForm();
        // either something different in this setup function
        // or have no setup function at all if only sets commentID and page
    }

    /**
     * Return the full, human readable name for the
     * current instrument.
     *
     * @return string the full name of the instrument
     */
    public function getFullName(): string
    {
        // get JSON schema
        // return schema['fullName]
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
      // get JSON schema
      // return schema['order'] where type=page plus ['description']
    }

    function getJSONSchema(): string
    {

    }
}


