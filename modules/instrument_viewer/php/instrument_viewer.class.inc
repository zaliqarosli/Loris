<?php

namespace LORIS\instrument_viewer;

class Instrument_Viewer
{
    public $skipTemplate = true;

    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    function setup()
    {
      
    }
}
