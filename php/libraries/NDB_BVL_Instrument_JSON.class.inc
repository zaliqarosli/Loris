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

/**
 * JSON Instrument subclass of Instrument Instance
 *
 * @category Main
 * @package  Instruments
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
use \LORIS\Data\ProvisionerInstance;
use \LORIS\Data\DataInstance;

class NDB_BVL_Instrument_JSON extends ProvisionerInstance
{
    protected $shortName;
    $DB = (\NDB_Factory::singleton())->database();

    public function getShortName(): string {
        return $this->shortName;
    }

    public function getFullName(): string {

    }

    public function loadInstanceData($commentID): \LORIS\Data\DataInstance
    {
      $this->commentID = $commentID;

      parent::__construct(
          'SELECT Data FROM flag WHERE CommentID=:CID',
          array('CID' => $this->commentID)
      )
    }

    public function getAllJSONSchemas() : array
    {
        $query = 'SELECT JsonSchema';

    }

    protected function getAllInstances() : \Traversable
    {
        $query = 'SELECT ij.InstrumentJsonID as InstrumentID,
                         ij.InstrumentHash as Hash,
                         tn.Test_name as ShortName,
                         tn.Full_name as FullName,
                         tn.Sub_group as Subgroup,
                         tn.IsDirectEntry as IsSurvey,
                         ij.JsonSchema,
                         ij.DateUpdated as LastUpdated,
                         ij.UserID as LastUpdatedBy,
                         ij.CurrentlyActive
                   FROM instrument_json ij
                   LEFT JOIN test_names tn ON ij.TestNamesID = tn.ID
                 ';
        $results = $DB->prepare($query)->execute();
        $instruments = array();
        if (!empty($results)) {
            foreach($results as $result) {
                $instrumentID = $result['InstrumentID'];
                unset($result['InstrumentID']);
                $instruments[$instrumentID] = $result;
            }
        }
        return new \ArrayIterator($instruments);
    }

    public final function __construct(string $shortName) {
        $this->shortName = $shortName;
    }

}


