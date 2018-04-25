<?php
/**
 * This file contains code for editing help content.
 * It holds the processing of adding/updating content
 * for all modules.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once 'Database.class.inc';
require_once 'helpfile.class.inc';

$user = \User::singleton();
if (!$user->hasPermission('context_help')) {
    header("HTTP/1.1 403 Forbidden");
    exit(
        "You do not have the correct permissions for this operation."
    );
}

$DB = \Database::singleton();
//Get the default values

// Sanitize user input
$safeSection    = htmlspecialchars($_REQUEST['section']);
$safeSubsection = htmlspecialchars($_REQUEST['subsection']);
if (isset($_REQUEST['helpID'])) {
    $helpID = htmlspecialchars($_REQUEST['helpID']);
}
if (isset($_REQUEST['parentID'])) {
    $parentID = htmlspecialchars($_REQUEST['parentID']);
}
if (!empty($_REQUEST['section'])) {
    $helpID = \LORIS\help_editor\HelpFile::hashToID(md5($_REQUEST['section']));
}
if (!empty($_REQUEST['section'])
    && $_REQUEST['subsection'] != 'undefined'
) {
    $helpID   = \LORIS\help_editor\HelpFile::hashToID(md5($_REQUEST['subsection']));
    $parentID = \LORIS\help_editor\HelpFile::hashToID(md5($_REQUEST['section']));
}
if (!empty($helpID)
    && isset($_POST['title'])
    && isset($_POST['content'])
) {
    $help_file = \LORIS\help_editor\HelpFile::factory($helpID);
    // update the help file
    $success = $help_file->update(
        array(
         'topic'   => $_POST['title'],
         'content' => $_POST['content'],
         'updated' => date(
             'Y-m-d h:i:s',
             time()
         ),
        )
    ); 
    echo $success;
} else {
  //content does not exist insert the help file
  if (!empty($_REQUEST['section'])
      && $_REQUEST['subsection'] != 'undefined'
      && empty($parentID)
  ) {
      //create parent help section first
      $parentID = \LORIS\help_editor\HelpFile::insert(
          array(
           'hash'    => md5($_REQUEST['section']),
           'topic'   => "",
           'content' => "Under construction",
           'created' => date(
               'Y-m-d h:i:s',
               time()
           ),
          )
      );
       // check errors

  }
  if (!empty($_REQUEST['section'])
      && $_REQUEST['subsection'] != 'undefined'
      && !empty($parentID)
  ) {

      // insert the help file
      $helpID = \LORIS\help_editor\HelpFile::insert(
          array(
           'parentID' => $parentID,
           'hash'     => md5($_REQUEST['subsection']),
           'topic'    => $_POST['title'],
           'content'  => $_POST['content'],
           'created'  => date(
               'Y-m-d h:i:s',
               time()
           ),
          )
      );

  } else if (!empty($_REQUEST['section'])
      && $_REQUEST['subsection'] == 'undefined'
  ) {
      //default case
      $helpID = \LORIS\help_editor\HelpFile::insert(
          array(
           'hash'    => md5($_REQUEST['section']),
           'topic'   => $_POST['title'],
           'content' => $_POST['content'],
           'created' => date(
               'Y-m-d h:i:s',
               time()
           ),
          )
      );
  }
}
exit();
