<?php

namespace LORIS\instruments;

class Instrument_Viewer extends \NDB_Page
{
    public $skipTemplate = true;
    var $instrumentName = "asdsp";

    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * Overrides base getJSDependencies() to add support for dicom specific
     * React column formatters.
     *
     * @return array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/instrument_viewer/js/instrumentViewerIndex.js",
            )
        );
    }
}
