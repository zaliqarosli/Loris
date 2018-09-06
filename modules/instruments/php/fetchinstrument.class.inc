<?php
namespace LORIS\instruments;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

class FetchInstrument extends \NDB_Page
{
    public $skipTemplate = true;
    var $instrumentName = "asdsp";

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
        $jsonInstrument = file_get_contents(__DIR__."/../../../project/instruments/examples/{$this->instrumentName}.json");
        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "application/json")
            ->withStatus(200)
            ->withBody(new \LORIS\Http\StringStream($jsonInstrument));

    }
}
