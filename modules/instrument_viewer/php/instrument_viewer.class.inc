<?php

namespace LORIS\instrument_viewer;

class Instrument_Viewer extends \NDB_Page
{
    public $skipTemplate = true;

    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * This acts as an AJAX endpoint that returns the data
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

        // Fetch data.
        $examinerID = $gets['identifier'];
        $results    = json_encode($this->fetchData($examinerID));
        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "application/json")
            ->withStatus(200)
            ->withBody(new \LORIS\Http\StringStream($results));

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
