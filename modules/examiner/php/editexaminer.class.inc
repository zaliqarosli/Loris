<?php
/**
 * Examiner module: Form used to update examiner certification status
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\examiner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class EditExaminer extends \NDB_Page
{
    /**
     * Checks if the user has access to the edit examiner form
     *
     * @return bool
     * @throws \ConfigurationException
     * @throws \DatabaseException
     * @throws \LorisException
     */

    public $skipTemplate = true;

    function _hasAccess()
    {
        if (empty($_REQUEST['identifier'])) {
            throw new LorisException(
                "Incorrect URL: No examiner ID provided."
            );
        }
        $DB     = \NDB_Factory::singleton()->database();
        $config = \NDB_Config::singleton();
        $user   = \User::singleton();

        $certification = $config->getSetting('Certification');

        if ($certification['EnableCertification'] ?? false) {
            $cids      = $DB->pselect(
                "SELECT epr.centerID 
                 FROM examiners e 
                  LEFT JOIN examiners_psc_rel epr ON (e.examinerID=epr.examinerID)
                 WHERE e.examinerID=:EID",
                array('EID' => $this->identifier)
            );
            $centerIDs =array();
            foreach ($cids as $k=>$row) {
                $centerIDs[] = $row['centerID'];
            }

            // Access is only granted if user sites are a superset of examiner sites
            // considering that certification changes affect all sites
            $permitted         = $user->hasPermission('examiner_view')
                && empty(array_diff($centerIDs, $user->getData('CenterIDs')));
            $permittedAllSites
                = $user->hasPermission('examiner_multisite');
            return $permitted || $permittedAllSites;
        }
        return false;
    }

    /**
     * Fetches default certification form values from the database.
     * Creates the certification history table ("Change Log").
     *
     * @return object JSON encoded array of default form values
     */
    function _getDefaults()
    {
      $db = \NDB_Factory::singleton()->database();

      // Get the certification results for the given examiner
      $result = $db-pselect(
        "SELECT testID, pass, date_cert, comment
         FROM certification
         WHERE examinerID=:EID",
        array('EID' => $this->identifier)
      );

      // Set the form defaults for the page
      foreach ($result as $row) {
        $defaults['date_cert[' . $row['testID'] . ']'] = $row['date_cert'];
        $defaults['certStatus[' . $row['testID'] . ']'] = $row['pass'];
        $defaults['comment[' . $row['testID'] . ']'] = $row['comment'];
      }

      return $defaults;
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
      parent::setup();
      $db     = \NDB_Factory::singleton()->database();
      $config = \NDB_Config::singleton();

      // Get the certification history from the database
      $certification_history = $db->pselect(
        "SELECT ch.userID, ch.changeDate, ch.old, ch.old_date,  
         tn.Full_name as Measure, ch.primaryVals, ch.new, ch.new_date 
         FROM certification_history ch  
         LEFT JOIN test_names tn ON (ch.testID=tn.ID) 
         LEFT JOIN certification c ON (c.certID=ch.primaryVals) 
         WHERE c.examinerID=:EID  
         ORDER BY changeDate DESC",
        array('EID' => $this->identifier)
      );
      $minYear = $config->getSetting('startYear');
      $maxYear = $config->getSetting('endYear');
      $instruments = $this->getCertificationInstruments();

      // Get the examiner name and site name, to be added to the form panel header
      $row = $db->pselectRow(
        "SELECT e.full_name
         FROM examiners e
         WHERE e.examinerID=:EID",
        array('EID' => $this->identifier)
      );
      $this->form->addFormRule(array(&$this, '_validateEditExaminer'));
    }

    /**
     * Validates the certification form values.
     *
     * @param array $values Certification from values
     *
     * @return array of error messages
     */
    function _validateEditExaminer($values)
    {
      $db = \NDB_Factory::singleton()->database();
      $errors = array();

      // Check that there is both a status and a date (neither can be null)
      foreach ($values['certStatus'] as $instrumentID => $certificationStatus) {
        if (empty($certificationStatus)
          || empty($values['date_cert'][$instrumentID])
        ) {
          if (($certificationStatus == "certified")
            && empty($values['date_cert'][$instrumentID])
          ) {
            $errors['certStatus[' . $instrumentID . ']'] = 'Both certification
              status and date must be filled out';
          }
        }
      }

      // Check if previously recorded certification are all present
      // (can not delete, only change status)
      $rows = $db->pselect(
        "SELECT c.testID
         FROM certification c
         WHERE c.examinerID=:EID",
        array('EID' => $this->identifier)
      );
      foreach ($rows as $row) {
        if ($values['certStatus'][$row['testID']] == "") {
          $errors['certStatus[' . $row['testID'] . ']']
            = 'You can not delete a status';
        }
      }
      return $errors;
    }

    /**
     * This acts as an AJAX endpoint.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
      // The parent handles things like hasAccess checks.
      $resp = parent::handle($request);
      switch ($resp->getStatusCode()) {
        case 200:
          // If it was a 200 code, it just means display was called and
          // access validated. We still need to do other validations
          // and add the result body.
          break;
        default:
          return $resp;
      }

      // Ensure it's a POST request.
      if ($request->getMethod() != "POST") {
        return (new \LORIS\Http\Response())
          ->withHeader("Content-Type", "text/plain")
          ->withStatus(405)
          ->withHeader("Allow", "POST")
          ->withBody(
            new \LORIS\Http\StringStream(
              "Only POST requests are allowed"
            )
          );
      }

      // Get parameters
      $posts = $request->getParsedBody();
      $examinerID = $this->identifier;
      $instruments = $this->getCertificationInstruments();

      // Process form data
      foreach ($instruments as $testID=>$row) {
        $data = json_decode($posts[$testID], true) ?? null;
        $this->process($data, $testID);
      }

      return (new \LORIS\Http\Response())
        ->withHeader("Content-Type", "application/json")
        ->withStatus(200);
    }

    /**
     * Handles the processing of the submitted data to DB
     *
     * @param array $data   the array of decoded json object containing
     *                      certification data
     * @param int   $testID the ID of the instrument for which the examiner's
     *                      certification is to be edited
     *
     * @return none
     */
    function process(array $data, int $testID)
    {
      $db   = \NDB_Factory::singleton()->database();
      $user = \User::singleton();

      // Set variables
      $comments = $data['comments'] ?? null;
      $date     = $data['date'] ?? null;
      $status   = $data['status'] ?? null;

      // Get the certificationID if it exists
      $certID = $db->pselectOne(
        "SELECT certID
         FROM certification
         WHERE examinerID=:EID AND testID=:TID",
        array(
          'EID' => $this->identifier,
          'TID' => $testID,
        )
      );

      // If the certification is for a new instrument for the examiner
      if (empty($certID) && !empty($status)) {
        // Insert a new certification entry
        $newData = array(
          'examinerID' => $this->identifier,
          'testID'     => $testID,
          'pass'       => $status,
          'comment'    => $comments,
        );
        if ($date != "") {
          $newData['date_cert'] = $date;
        }
        $db->insert(
          'certification',
          $newData
        );

        // Add a new entry to the certification history table
        $data = array(
          'col'         => 'pass',
          'new'         => $status,
          'primaryVals' => $certID,
          'testID'      => $testID,
          'visit_label' => null,
          'changeDate'  => date("Y-m-d H:i:s"),
          'userID'      => $user->getUsername(), 
          'type'        => 'I',
        );
        if ($date != "") {
          $data['new_date'] = $date;
        }
        $db->insert(
          'certification_history',
          $data
        );
      } else {  // Update an existing test certification for the examiner
        // Select history events
        $oldVals = $db->pselectRow(
          "SELECT ch.new, ch.new_date
           FROM certification_history ch
           LEFT JOIN certification c ON (c.certID=ch.primaryVals)
           WHERE c.examinerID=:EID AND ch.testID=:TID
           ORDER BY changeDate DESC",
          array(
            'EID' => $this->identifier,
            'TID' = > $testID,
          )
        );
        $oldStatus  = $oldVals['new'] ?? null;
        $oldDate    = $oldVals['new_date'] ?? null;
        // Select existing test certification in db
        $currentCert = $db->peselectRow(
          "SELECT pass, date_cert, comment
           FROM certification
           WHERE examinerID=:EID AND testID=:TID",
          array(
            'EID' => $this->identifier,
            'TID' => $testID,
          )
        );

        // If one of the values of current certification
        // was changed, update certification with new values
        if ($currentCert['pass'] != $status
          || $currentCert['comment'] != $comments
          || $currentCert['date_cert'] != $date
        ) {
          // Update the certification entry
          $data = array(
            'pass'    => $status,
            'comment' => $comments,
          );
          if ($date != "") {
            $data['date_cert'] = $date;
          }
          $db->update(
            'certification',
            $data,
            array(
              'examinerID' => $examinerID,
              'testID'     => $testID,
            )
          );
          // Add the change as new entry to the history table
          if ($oldDate != $date || $oldStatus != $status) {
            $data = array(
              'col'         => 'pass'
              'old'         => $oldStatus,
              'new'         => $status,
              'primaryVals' => $certID,
              'testID'      => $testID,
              'visit_label' => null,
              'changeDate'  => date("Y-m-d H:i:s"),
              'userID'      => $user->getUsername(),
              'type'        => 'U',
            );
            if ($oldDate != "") {
              $data['old_date'] = $oldDate;
            }
            if ($date != "") {
              $data['new_date'] = $date;
            }
            $db->insert(
              'certification_history',
              $data
            );
          }
        }
      }
    }

    /**
     * Grabs the certification instruments from the config and creates an array.
     * The instrument id id the key, and the instrument label is the value.
     *
     * @return array of instruments requiring certification
     */
    function getCertificationInstruments()
    {
        $config = \NDB_Config::singleton();
        $DB     = \Database::singleton();

        // Get the instruments requiring certification from the config
        $certificationConfig      = $config->getSetting("Certification");
        $certificationInstruments = $certificationConfig['CertificationInstruments'];

        $certificationInstruments['test']
            = \Utility::toArray($certificationInstruments['test']);
        $instruments = array();

        foreach ($certificationInstruments['test'] as $certificationInstrument) {
            $testName = $certificationInstrument['@']['value'];
            $testID   = $DB->pselectOne(
                "SELECT ID
                 FROM test_names
                 WHERE Test_name
                 LIKE CONCAT('%', :testName, '%')",
                array('testName' => $testName)
            );
            $instruments[$testID] = $certificationInstrument['#'];
        }

        return $instruments;
    }
    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $label = ucwords(str_replace('_', ' ', $this->name));
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb($label, "/$this->name"),
            new \LORIS\Breadcrumb(
                'Edit Examiner',
                "/examiner/editExaminer/?identifier=$this->identifier"
            )
        );
    }

    /**
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
               $baseURL . "/examiner/js/editExaminer.js",
           )
       );
   }
    /**
     * @return array of CSS to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/examiner/css/editExaminer.css",
            )
        );
    }
}
?>
