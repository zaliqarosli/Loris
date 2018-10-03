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

class EditExaminer extends \NDB_Form
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

        $user         = \User::singleton();
        $userFullName = $user->getFullname();
        $userCenter   = $user->getCenterIDs();

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
