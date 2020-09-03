<?php
/**
 * Instrument builder module: Instrument JSON data handler used to
 * create, edit, and submit instrument json
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
 * Instrument builder module: Instrument JSON data handler used to
 * create, edit, and submit instrument json
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class InstrumentJSON extends \NDB_Page
{
    protected $schemaID;
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
              [
                  'schemaJSON' => $this->handleGET($this->schemaID)
              ]
          ));
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
     * @return array The json decoded JSON schema
     */
    function handleGET(string $schemaID): array
    {
        $provisioner = new InstrumentRowProvisioner($schemaID);
        $instance    = (new \LORIS\Data\Table())
                        ->withDataFrom($provisioner)
                        ->toArray(\User::singleton());

        return json_decode(
            html_entity_decode(
                html_entity_decode($instance[0]['schemaJson'])
            ), true);
    }
}
