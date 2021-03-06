<?php
/**
 * Unit test for Candidate class
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Main
 * @author   Karolina Marasinska <karolina.marasinska@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Unit test for Candidate class
 *
 * @category Tests
 * @package  Main
 * @author   Karolina Marasinska <karolina.marasinska@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateTest extends PHPUnit_Framework_TestCase
{
    /**
     * Candidate Information as available in the Candidate object
     *
     * @var array contains _candidate info retrieved by the select method
     */
    private $_candidateInfo
        = array(
           'CenterID'     => '2',
           'CandID'       => '969664',
           'PSCID'        => 'AAA0011',
           'DoB'          => '2007-03-02',
           'EDC'          => null,
           'Gender'       => 'Male',
           'PSC'          => 'AAA',
           'Ethnicity'    => null,
           'Active'       => 'Y',
           'RegisteredBy' => 'Admin Admin',
           'UserID'       => 'admin',
           'ProjectID'    => 1,
          );

    /**
     * List of timepoints (visits) that a Candidate has registered
     *
     * @var array list of time points are retrieved in the select method
     */
    private $_listOfTimePoints = array();

    /**
     * Candidate object use in tests
     *
     * @var Candidate
     */
    private $_candidate;

    /**
     * NDB_Factory used in tests.
     * Test doubles are injected to the factory object.
     *
     * @var NDB_Factory
     */
    private $_factory;

    /**
     * Test double for NDB_Config object
     *
     * @var NDB_Config | PHPUnit_Framework_MockObject_MockObject
     */
    private $_configMock;

    /**
     * Test double for Database object
     *
     * @var Database | PHPUnit_Framework_MockObject_MockObject
     */
    private $_dbMock;

    /**
     * Maps config names to values
     * Used to set behavior of NDB_Config test double
     *
     * @var array config name => value
     */
    private $_configMap = array();


    /**
     * Sets up fixtures:
     *  - _candidate object
     *  - config and Database test doubles
     *  - _factory
     *
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp()
    {
        parent::setUp();

        $this->_configMap = array(
                             array(
                              'useProjects',
                              false,
                             ),
                             array(
                              'HeaderTable',
                              null,
                             ),
                            );

        $this->_listOfTimePoints = array(
                                    array('ID' => '97'),
                                    array('ID' => '98'),
                                   );

        $this->_configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_dbMock     = $this->getMockBuilder('Database')->getMock();

        $this->_factory   = NDB_Factory::singleton();
        $this->_candidate = new Candidate();

        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);
    }

    /**
     * Tears down the fixture, for example, close a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown()
    {
        parent::tearDown();
        $this->_factory->reset();
    }

    /**
     * Test select() method retrieves all _candidate and related info
     *
     * @return void
     * @covers Candidate::select
     * @covers Candidate::getData
     * @covers Candidate::getListOfTimePoints
     */
    public function testSelectRetrievesCandidateInfo()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_candidate->select(969664);

        //validate _candidate Info
        $this->assertEquals($this->_candidateInfo, $this->_candidate->getData());

        //validate list of time points
        $expectedTimepoints = array();
        foreach ($this->_listOfTimePoints as $oneRow) {
            $expectedTimepoints[] = $oneRow['ID'];
        }
        $this->assertEquals(
            $expectedTimepoints,
            $this->_candidate->getListOfTimePoints()
        );
    }

    /**
     * Test select() method fails when invalid _candidate ID is passed
     *
     * @return void
     * @covers Candidate::select
     * @throws LorisException
     */
    public function testsSelectFailsWhenInvalidCandidateIdPassed()
    {

        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn(false);

        $this->setExpectedException('LorisException');
        $this->_candidate->select('invalid value');

    }

    /**
     * Test setData method sets data when passing data as an array
     *
     * @return void
     * @covers Candidate::setData
     * @covers Candidate::getData
     */
    public function testSetDataWithArraySucceeds()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $data = array('Active' => 'N');
        //assert update method is called with correct parameters
        $this->_dbMock->expects($this->once())
            ->method('update')
            ->with(
                'candidate',
                $data,
                array('CandID' => $this->_candidateInfo['CandID'])
            );

        $this->assertTrue($this->_candidate->setData($data));
        $this->assertEquals($data['Active'], $this->_candidate->getData('Active'));
    }

    /**
     * Test setData method sets data when passing variable name and value
     *
     * @return void
     * @covers Candidate::setData
     * @covers Candidate::getData
     */
    public function testSetDataWithValueSucceeds()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $data = array('RegisteredBy' => 'TestUser');
        //assert update method is called with correct parameters
        $this->_dbMock->expects($this->once())
            ->method('update')
            ->with(
                'candidate',
                $data,
                array('CandID' => $this->_candidateInfo['CandID'])
            );

        $this->assertTrue($this->_candidate->setData('RegisteredBy', 'TestUser'));
        $this->assertEquals(
            $data['RegisteredBy'],
            $this->_candidate->getData('RegisteredBy')
        );
    }

    /**
     * Test getListOfVisitLabels returns array
     * of visit labels with corresponding SessionID as key
     *
     * @covers Candidate::getListOfVisitLabels
     * @return void
     */
    public function testGetListOfVisitLabels()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $selectReturns = array(
                          array(
                           'ID'          => '97',
                           'Visit_label' => 'V01',
                          ),
                          array(
                           'ID'          => '98',
                           'Visit_label' => 'V02',
                          ),
                         );

        //mock pselect from getListOfVisitLabels
        $this->_dbMock->expects($this->at(2))
            ->method('pselect')
            ->with(
                $this->stringStartsWith('SELECT ID, Visit_label FROM session'),
                $this->arrayHasKey('Candidate')
            )
            ->willReturn($selectReturns);

        $expected = array();
        foreach ($selectReturns as $oneRow) {
            $expected[$oneRow['ID']] = $oneRow['Visit_label'];
        }

        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals($expected, $this->_candidate->getListOfVisitLabels());

    }

    /**
     * Test getNextVisitLabel returns the next label
     *
     * @covers Candidate::getNextVisitLabel
     * @return void
     */
    public function testGetNextVisitLabelReturnsNextLabel()
    {
        //set config 'visitLabel' values
        $this->_configMap[] = array(
                               'visitLabel',
                               array(
                                'generation' => 'user',
                                'suggest'    => 'V%value%',
                               ),
                              );
        $this->_setUpTestDoublesForSelectCandidate();

        $existingVisitLabels = array(
                                array(
                                 'ID'          => '97',
                                 'Visit_label' => 'V01',
                                ),
                                array(
                                 'ID'          => '98',
                                 'Visit_label' => 'V02',
                                ),
                               );

        //mock pselect() from getListOfVisitLabels
        $this->_dbMock->expects($this->at(2))
            ->method('pselect')
            ->with(
                $this->stringStartsWith('SELECT ID, Visit_label FROM session'),
                $this->arrayHasKey('Candidate')
            )
            ->willReturn($existingVisitLabels);

        //mock pselectRow from getNextVisitLabel
        $this->_dbMock->expects($this->at(3))
            ->method('pselectRow')
            ->with(
                $this->stringStartsWith(
                    'SELECT IFNULL(max(VisitNo)+1, 1) AS nextVisitLabel'
                )
            )
            ->willReturn(array('nextVisitLabel' => '3'));

        $this->_candidate->select(969664);
        $this->assertEquals('V3', $this->_candidate->getNextVisitLabel());
    }


    /**
     * Test getNextVisitLabel returns 1st visit label
     * when there are no existing visit labels
     *
     * @covers Candidate::getNextVisitLabel
     * @return void
     */
    public function testGetNextVisitLabelWhenThereAreNoExistingVisitLabels()
    {
        $this->_listOfTimePoints = array();
        //set config 'visitLabel' values
        $this->_configMap[] = array(
                               'visitLabel',
                               array(
                                'generation' => 'user',
                                'suggest'    => 'V%value%',
                               ),
                              );
        $this->_setUpTestDoublesForSelectCandidate();

        $existingVisitLabels = array();

        //mock pselect from getListOfVisitLabels
        $this->_dbMock->expects($this->at(2))
            ->method('pselect')
            ->with(
                $this->stringStartsWith('SELECT ID, Visit_label FROM session'),
                $this->arrayHasKey('Candidate')
            )
            ->willReturn($existingVisitLabels);

        //mock pselectRow from getNextVisitLabel
        $this->_dbMock->expects($this->at(3))
            ->method('pselectRow')
            ->with(
                $this->stringStartsWith(
                    'SELECT IFNULL(max(VisitNo)+1, 1) AS nextVisitLabel'
                )
            )
            ->willReturn(false);

        $this->_candidate->select(969664);
        $this->assertEquals('V1', $this->_candidate->getNextVisitLabel());
    }

    /**
     * Test getNextVisitLabel returns null when no 'visitLabel'
     * settings are present in config.xml
     *
     * @covers Candidate::getNextVisitLabel
     * @return void
     */
    public function testGetNextVisitLabelWhenNoVisitLabelSettingInConfig()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select(969664);

        $this->assertNull($this->_candidate->getNextVisitLabel());
    }

    /**
     * Test Candidate::getValidSubprojects returns a list
     * of valid subprojects for a specific project
     *
     * @covers Candidate::getValidSubprojects
     * @return void
     */
    public function testGetValidSubprojectsReturnsAListOfSubprojects()
    {
        $subprojects = array(
                        array('SubprojectID' => 1),
                        array('SubprojectID' => 2),
                       );
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->at(2))
            ->method('pselect')
            ->willReturn(
                $subprojects
            );

        $this->_candidate->select(969664);

        $expectedSubprojects = array(
                                1 => 1,
                                2 => 2,
                               );
        $this->assertEquals(
            $expectedSubprojects,
            $this->_candidate->getValidSubprojects()
        );
    }

    /**
     * Test getValidSubprojects returns NULL when there are no subprojects in DB
     *
     * @covers Candidate::getValidSubprojects
     * @return void
     */
    public function testGetValidSubprojectsReturnsNull()
    {
        $subprojects = array();
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->at(2))
            ->method('pselect')
            ->willReturn(
                $subprojects
            );

        $this->_candidate->select(969664);

        $this->assertNull($this->_candidate->getValidSubprojects());
    }

    /**
     * Test getFirstVisit returns first visit's label
     *
     * @covers Candidate::getFirstVisit
     * @return void
     */
    public function testGetFirstVisitReturnsFirstVisitLabel()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->at(2))
            ->method('pselectOne')
            ->willReturn('V01');

        $this->_candidate->select(969664);
        $this->assertEquals('V01', $this->_candidate->getFirstVisit());
    }

    /**
     * Test getSessionID returns session ID for a given existing visit
     *
     * @covers Candidate::getSessionID
     * @return void
     */
    public function testGetSessionIDForExistingVisit()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select(969664);

        $this->assertEquals(97, $this->_candidate->getSessionID(1));
        $this->assertEquals(98, $this->_candidate->getSessionID(2));
    }

    /**
     * Test getSessionID returns NULL for none existing visit
     *
     * @covers Candidate::getSessionID
     * @return void
     */
    public function testGetSessionIDReturnsNullForNoneExistingVisit()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select(969664);

        $this->assertNull($this->_candidate->getSessionID(0));
    }

    /**
     * Test static function Candidate::candidateExists
     * returns true when _candidate exists
     *
     * @covers Candidate::candidateExists
     * @return void
     */
    public function testCandidateExistsReturnsTrueWhenCandidateExists()
    {
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn(array('CandID' => 969664));

        $this->assertTrue(Candidate::candidateExists(969664, 'AAA0011'));
    }

    /**
     * Test static function Candidate::candidateExists
     * returns true when _candidate does not exist
     *
     * @covers Candidate::candidateExists
     * @return void
     */
    public function testCandidateExistsReturnsFalseWhenCandidateDoesNotExists()
    {
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn(false);

        $this->assertFalse(Candidate::candidateExists(123, 'Test'));
    }

    /**
     * Test static function Candidate::_generateCandID
     * returns first generated _candidate ID
     * (i.e. 1st generated ID does not exist in DB)
     *
     * @covers Candidate::_generateCandID
     * @return void
     */
    public function testGenerateCandIDReturnsFirstGeneratedID()
    {
        $this->_dbMock->expects($this->once())
            ->method('pselectOne')
            ->willReturn(0);

        $candidateID = Candidate::_generateCandID();
        $this->assertGreaterThanOrEqual(CANDIDATE_MIN_CANDID, $candidateID);
        $this->assertLessThanOrEqual(CANDIDATE_MAX_CANDID, $candidateID);
    }

    /**
     * Test static function Candidate::_generateCandID
     * returns second generated _candidate ID
     * when 1st one exists in DB
     *
     * @covers Candidate::_generateCandID
     * @return void
     */
    public function testGenerateCandIDReturnsSecondGeneratedID()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->will($this->onConsecutiveCalls(CANDIDATE_MIN_CANDID, 0));

        $candidateID = Candidate::_generateCandID();
        $this->assertGreaterThanOrEqual(CANDIDATE_MIN_CANDID, $candidateID);
        $this->assertLessThanOrEqual(CANDIDATE_MAX_CANDID, $candidateID);
    }

    /**
     * Test Candidate::_generateCandID for config setting
     * generation = random, & type=numeric
     *
     * @covers Candidate::_generatePSCID
     * @return void
     */
    public function testGeneratePSCIDForRandomNumericGeneration()
    {

        $seq = array(
                'seq' => array(
                          0 => array(
                                '#' => '',
                                '@' => array('type' => 'siteAbbrev'),
                               ),
                          1 => array(
                                '#' => '',
                                '@' => array(
                                        'type'      => 'numeric',
                                        'minLength' => '4',
                                       ),
                               ),
                         ),
               );

        $this->_configMap = array(
                             array(
                              'PSCID',
                              array(
                               'generation' => 'random',
                               'structure'  => $seq,
                              ),
                             ),
                            );

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));

        //mock Database::pselectOne(), returns count 0
        //case when generated PSCID is not used, therefore not found in DB
        $this->_dbMock->expects($this->once())
            ->method('pselectOne')
            ->willReturn(0);

        $this->assertRegExp('/AAA[0-9]{4}$/', Candidate::_generatePSCID('AAA'));
    }

    /**
     * Test static function Candidate::_generatePSCID for config setting
     * generation=sequential & type=numeric
     * For this test _generatePSCID should return 3rd generated PSCID,
     * since 2 other ones already exist in DB
     *
     * @covers Candidate::_generatePSCID
     * @return void
     */
    public function testGeneratePSCIDForSequentialNumericGeneration()
    {

        $seq = array(
                'seq' => array(
                          0 => array(
                                '#' => '',
                                '@' => array('type' => 'siteAbbrev'),
                               ),
                          1 => array(
                                '#' => '',
                                '@' => array(
                                        'type'      => 'numeric',
                                        'minLength' => '4',
                                       ),
                               ),
                         ),
               );
        $this->_configMap = array(
                             array(
                              'PSCID',
                              array(
                               'generation' => 'sequential',
                               'structure'  => $seq,
                              ),
                             ),
                            );

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));

        //mock pselectOne
        // First 2 calls to select one return count = 1
        //case when first 2 generated PSCIDs already exist in DB
        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->will($this->onConsecutiveCalls(1, 1, 0));

        $this->assertEquals('AB0002', Candidate::_generatePSCID('AB'));
    }

    /**
     * Test Candidate::validatePSCID with both valid and invalid PSCID
     *
     * @covers Candidate::validatePSCID
     * @return void
     */
    public function testValidatePSCID()
    {
        $seq = array(
                'seq' => array(
                          0 => array(
                                '#' => '',
                                '@' => array('type' => 'siteAbbrev'),
                               ),
                          1 => array(
                                '#' => '',
                                '@' => array(
                                        'type'      => 'numeric',
                                        'minLength' => '4',
                                       ),
                               ),
                         ),
               );
        $this->_configMap = array(
                             array(
                              'PSCID',
                              array(
                               'generation' => 'sequential',
                               'structure'  => $seq,
                              ),
                             ),
                            );

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));

        $this->assertEquals(
            1,
            Candidate::validatePSCID('AAA0012', 'AAA'),
            'Valid PSCID: validatePSCID should return 1'
        );
        $this->assertEquals(
            0,
            Candidate::validatePSCID('AAA001', 'AAA'),
            'Invalid PSCID: validatePSCID should return 0'
        );
    }

    /**
     * Test Candidate::createNew
     *
     * @covers Candidate::createNew
     * @return void
     */
    public function testCreateNew()
    {
        //$this->markTestIncomplete("Test not implemented!");
    }

    /**
     * Set up test doubles behavior for Candidate::select() method
     *
     * @return void
     */
    private function _setUpTestDoublesForSelectCandidate()
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselectRow')
            ->willReturn($this->_candidateInfo);

        $this->_dbMock->expects($this->at(1))
            ->method('pselect')
            ->willReturn(
                $this->_listOfTimePoints
            );

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));
    }


}
