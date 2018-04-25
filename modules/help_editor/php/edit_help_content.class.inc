<?php
/**
 * This file sets up the Edit Help Content page and form.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\help_editor;

class Edit_Help_Content extends \NDB_Form
{
    var $indent = "&nbsp;&nbsp;&nbsp;&nbsp;";
     /**
     * Determine if user has permission to access this page
     *
     * @return boolean true if access is permitted
     */
    function _hasAccess()
    {
        // create user object
        $user = \User::singleton();

            // check user permissions
        return $user->hasPermission('context_help');
    }
     /**
      * Returns default help content of the page
      *
      * @return default array
      */
    function _getDefaults()
    {
        $DB = \Database::singleton();
        //Get the default values

        // Sanitize user input
        $safeHelpID     = htmlspecialchars($_REQUEST['helpID']);
        $safeSection    = htmlspecialchars($_REQUEST['section']);
        $safeSubsection = htmlspecialchars($_REQUEST['subsection']);
        if (isset($_REQUEST['helpID'])) {
            $helpID = $safeHelpID;
        }
        if (!empty($_REQUEST['section'])) {
            $helpID = HelpFile::hashToID(md5($_REQUEST['section']));
        }
        if (!empty($_REQUEST['section'])
            && $_REQUEST['subsection'] != 'undefined'
        ) {
            $helpID = HelpFile::hashToID(md5($_REQUEST['subsection']));
        }
        $this->tpl_data['section']    = $safeSection;
        $this->tpl_data['subsection'] = $safeSubsection;
        if (!empty($helpID)) {
            $help_file = HelpFile::factory($helpID);
            $data      = $help_file->toArray();
            $defaults['title']   = $data['topic'];
            $defaults['content'] = utf8_encode(trim($data['content']));
            if (isset($_REQUEST['helpID'])) {
                $this->tpl_data['module_name'] = "Help Editor";
            } else {
                $this->tpl_data['module_name'] = $defaults['title'];
            }

        }
        // case where no help content exists
        if (empty($defaults['title'])) {
            if (!empty($_REQUEST['section'])) {
                $defaults['title'] = str_replace("_", " ", $safeSection);
            }
            // if not module and not instrument, should be a subtest
            if ($_REQUEST['subsection'] != 'undefined') {
                $defaults['title'] = str_replace("_", " ", $safeSubsection);
            }
            $this->tpl_data['module_name'] = $defaults['title'];
        }
        if (empty($defaults['content'])) {
            $defaults['content'] = 'Under Construction';
        }

        if (isset($_SERVER['HTTP_REFERER']) ) {
            $this->tpl_data['url'] = $_SERVER['HTTP_REFERER'];
            echo $this->tpl_data['url'];
        }

        return $defaults;
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return none
     */
    function setup()
    {
        parent::setup();

        $this->addBasicText('title', 'Title');
        $this->addBasicTextArea(
            'content',
            'Content',
            array(
             'cols' => 140,
             'rows' => 30,
            )
        );

    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/help_editor/js/help_editor_helper.js",
            )
        );
    }
}

?>
