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

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Fetches instrument schema for Build page
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class FetchSchema extends \NDB_Page
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
     * Custom handle function for this class
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->setup();
        // Ensure it's a GET request.
        if ($request->getMethod() != "GET") {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "GET")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        "Only GET requests are allowed."
                    )
                );
        }

        $params = $request->getQueryParams();
        if (isset($params['schemaID'])) {
            $schemaID   = $params['schemaID'];
            $schemaJSON = \Loris\Behavioural\NDB_BVL_Instrument_JSON::getSchemaJSONByID($schemaID);

            $result = array(
                'schemaJSON' => json_decode($schemaJSON),
                'schemaID'   => $schemaID,
            );
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withStatus(200)
                ->withBody(new \LORIS\Http\StringStream(json_encode($result)));
        }
    }
}
