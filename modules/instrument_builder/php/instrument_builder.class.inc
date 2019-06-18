<?php
/**
 * Instrument_builder class
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\instrument_builder;
/**
 * Instrument_builder class
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Instrument_Builder extends \NDB_Menu_Filter
{
    public $skipTemplate = true;

    /**
     * Checks access to user
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('instrument_builder');
    }

    /**
     * Setup Variables
     *
     * @note   Setup Variables
     * @return void
     */
    function _setupVariables()
    {
        $user =& \User::singleton();
        // the base query
        $query = " FROM test_names";

        // set the class variables
        $this->columns      = array(
                               'ID AS instrumentID',
                               'Test_name AS instrumentName',
                               'Full_name AS description',
                              );
        $this->query        = $query;
        $this->validFilters = array(
                               'test_names.ID',
                               'test_names.Test_name',
                               'test_names.Full_name',
                              );

        $this->formToFilter = array(
                               'instrumentID'  => 'test_names.ID',
                               'instrumentName'    => 'test_names.Test_name',
                               'description'    => 'test_names.Full_name',
                              );
    }

    /**
     * Include additional JS files
     *
     * @return array of JS to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = parent::getJSDependencies();
        return array_merge(
            $depends,
            array($baseurl . "/instrument_builder/js/instrumentBuilderIndex.js")
        );
    }
}

