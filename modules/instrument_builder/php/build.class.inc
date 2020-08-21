<?php
/**
 * This Build page of the Instrument Builder module
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
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * This Build page of the Instrument Builder module
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Build extends \NDB_Form
{
    protected $schemaID;
    public    $skipTemplate = true;

    /**
     * Checks access to user
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        $schemaIDExists = !empty($this->schemaID);
        return ($schemaIDExists || $user->hasPermission('instrument_builder'));
    }

    /**
     * Sets up required items for this page
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
    }

    /**
     * Handles the incoming request for the builder. 
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch($request->getMethod()) {
        case 'GET':
          $this->schemaID = basename($request->getURI()->getPath());
          if (empty($this->schemaID) && $this->schemaID != "new") {
              return (new \LORIS\Http\Response\NotFound());
          }
          return (new \LORIS\Http\Response\JsonResponse(
                  $this->handleGET($this->schemaID)
              )
          );
        case 'PUT':
          return $this->handlePUT();
        case 'PATCH':
          return $this->handlePATCH();
        case 'POST':
          return $this->handlePOST();
        default:
          return (new \LORIS\Http\Response\JSON\MethodNotAllowed(
              ["GET,PUT,PATCH,POST"]
          ));
        }
    }

    /**
     * Handles the builder GET request
     *
     * @param string $schemaID The identifying name of the
     *                         instrument schema
     *
     * @return string The json encoded JSON schema
     */
    function handleGET(string $schemaID): string
    {
        $provisioner = new InstrumentRowProvisioner($schemaID);
        $instance    = (new \LORIS\Data\Table())
                        ->withDataFrom($provisioner)
                        ->toArray(\User::singleton());

        return $instance[0]['schemaJson'];
    }

    /**
     * Include additional CSS files
     *
     * @return array of CSS to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/instrument_builder/css/instrument_builder.css"]
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
            array($baseurl . "/instrument_builder/js/builder.js")
        );
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
                'Build',
                "/instrument_builder/build/$this->schemaID"
            )
        );
    }
}
