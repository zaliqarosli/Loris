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
     * Does the setup required for this page
     *
     * @return void
     */
    function setup()
    {
        $this->form->addFormRule(array(&$this, '_validateLoadInstrument'));
    }

    /**
     * Validates the load instrumnet value.
     *
     * @param array $values Load Instrument form values
     *
     * @return array $errors
     */
    function _validateLoadInstrument($values)
    {
        $file = $values['fileToLoad'];
        if (empty($file)) {
            $errors['fileEmpty'] = 'Instrument file is required.';
        }
        return $errors;
    }

    /**
     * Processes the load instrument form values
     *
     * @param array $values load instrument form values
     *
     * @return void
     */
    function _process($values)
    {

    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    function getDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new InstrumentRowProvisioner();
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the data from this table
     */
    function toJSON()
    {
        $user = \User::singleton();
        $db   = \NDB_Factory::singleton()->database();

        $table = (new \LORIS\Data\Table())
            ->withDataFrom($this->getDataProvisioner());
        $arr   = array('data' => $table->toArray($user));
        return json_encode($arr);
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

