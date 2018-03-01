<?php
/**
 * This script is written for a one time use only to normalise the consent feature of candidate parameters. 
 * 
 * New normalised tables will be populated with existing data from `participant_status` and `consent_info_history`.
 * 
 * A SQL file is exported to path: loris_root/SQL/Cleanup/delete_old_consent_tables.sql
 * after running this script. Source this file to delete the now deprecated tables and columns.
 * 
 * affected tables:
 * - participant_status
 * - consent_info_history
 * - consent
 * - candidate_consent_rel
 * - candidate_consent_history
 * 
 * PHP Version 7
 * 
 * @category Main 
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */

require_once 'generic_includes.php';

$config = NDB_Config::singleton();
$db     =& Database::singleton();

// Get consent details from Config.xml
$consentConfig = $config->getSettingFromXML('ConsentModule');
$useConsent = $consentConfig['useConsent'];
$consents = $consentConfig['Consent'];

///////////////////////////////////////
// VALIDATE EXISTING CONSENT DETAILS //
///////////////////////////////////////

$errors = [];
// Check for when consent columns exist in participant_status but not in Config.xml
$columnQuery = 'SELECT Column_name FROM Information_schema.columns WHERE
                Column_name LIKE "%consent%" AND Table_name LIKE "participant_status"';
$existingColumns = $db->pselect($columnQuery, array());

// Format result to only keep consent name columns
$formattedColumns = [];
foreach ($existingColumns as $column) {
    $columnName = $column['Column_name']; 
    if (!(preg_match("/date/", $columnName) || preg_match("/withdrawal/", $columnName))) {
        array_push($formattedColumns, $columnName);
    }
}
// Check that column names are in list of consent names
foreach ($formattedColumns as $columnName) {
    $i=0;
    foreach ($consents as $consent){
        $consentName = $consent['name'];
        if($consentName===$columnName) {
            $i++;
        }
    }
    if ($i===0) {
        array_push(
            $errors, "The consent type " . $columnName . " exists in the database but not in Config.xml.
           Please add the consent to Config.xml or delete columns and data from 'participant_status'"
        );
    }
}
// Check that consent status, date, and withdrawal columns exist in participant_status
foreach ($consents as $consent) {
    $consentName       = $consent['name'];
    $consentDate       = $consentName . "_date";
    $consentWithdrawal = $consentName . "_withdrawal";
    $statusExists      = $db->columnExists('participant_status', $consentName);
    $dateExists        = $db->columnExists('participant_status', $consentDate);
    $withdrawalExists  = $db->columnExists('participant_status', $consentWithdrawal);
    if (!($statusExists && $dateExists && $withdrawalExists)) {
        array_push($errors, "At least one column is missing for " . $consentName . " in participant_status table.
           Check that status, date, and withdrawal columns exist for this consent type.");
    } else {
        // Check for zero dates
        $dateQuery = 'SELECT ID, CandID, ' . $consentDate . ', ' . $consentWithdrawal . ' FROM participant_status 
                      WHERE ' . $consentName . ' IS NOT NULL OR ' . $consentName . ' != ""';
        $psData    = $db->pselect($dateQuery, array());
        foreach ($psData as $entry) {
            if($entry[$consentDate] === "0000-00-00" || $entry[$consentWithdrawal] === "0000-00-00") {
                array_push($errors, "Zero dates found in participant_status for:
                           [ID]     => " . $entry['ID'] . "
                           [CandID] => " . $entry['CandID'] . "
                           Please remove date or run /tools/DB_date_zeros_removal.php.");
            }
        }
    }
}
//////////////////
// THROW ERRORS //
//////////////////
if (!empty($errors)) {
    print_r($errors);
    die("Resolve errors and run script again.\n");
} else {
    echo "\nValidation successful.\n";
}

/////////////////////
// CONTINUE SCRIPT //
/////////////////////

// Update ConfigSetting table with value of 'useConsent' if true. Default is set to false.
$configID = $db->pselectOne(
    'SELECT ID FROM ConfigSettings WHERE Name="useConsent"',
    array()
);
if ($useConsent === "true") {
    $updateValue = ['Value' => $useConsent];
    $db->update(
        'Config',
        $updateValue,
        array (
         'ConfigID' => $configID, 
        )
    );
    echo "\nConfig settings set to use consent.\n\n";
}

/////////////////////////////////////////////
// START IMPORT OF CONSENT INTO NEW TABLES //
/////////////////////////////////////////////

$consentType = [];
$printArray  = [];
foreach ($consents as $key=>$consent) {
    $consentName       = $consent['name'];
    $consentLabel      = $consent['label'];
  
    // Populate consent table with consents from Config.xml
    $db->insert(
        'consent', 
        array(
           'Name'  => $consentName,
           'Label' => $consentLabel,
         )
    );
    // Save ConsentID inserted
    $consentID = $db->pselectOne(
        'SELECT ConsentID FROM consent WHERE Name=:consentName',
        array('consentName' => $consentName)
    );
    // Create array of consents to use later in importing history data
    $consent[$consentName] = $consentLabel;

    // Get all data where consent status has a value in participant_status
    $consentDate       = $consentName . "_date";
    $consentWithdrawal = $consentName . "_withdrawal";
    $dataQuery         = 'SELECT CandID, ' . $consentName . ', ' . $consentDate . ', ' . $consentWithdrawal . ' FROM participant_status 
                         WHERE ' . $consentName . ' IS NOT NULL OR ' . $consentName . ' != ""';
    $psData            = $db->pselect($dataQuery, array());
    print_r($psData);
    foreach ($psData as $entry) {
        // Import 'not_answered' status as NULL
        if ($entry[$consentName] === "not_answered") {
            $entry[$consentName] = "";
        }
        // Format data
        $consentValues = [
            'CandidateID'   => $entry['CandID'],
            'ConsentID'     => $consentID,
            'Status'        => $entry[$consentName],
            'DateGiven'     => $entry[$consentDate],
            'DateWithdrawn' => $entry[$consentWithdrawal],
        ];
        // Push each formatted entry to array
        array_push($printArray, $consentValues);
    }
}

// Output list of data to be inserted into new table
echo "\nRows to be inserted into 'candidate_consent_rel' table ..\n";
echo "Empty values will be inserted as NULL.\n\n";
print_r($printArray);

// Populate candidate_consent_rel
foreach ($printArray as $consentValues) {
    $db->insert('candidate_consent_rel', $consentValues);
}

echo "\nConsent data insert complete.\n";

// Select consent history and import into new history table
$historyFieldsQuery = 'SELECT CandID, entry_staff, data_entry_date';
foreach ($consent as $consentName => $consentLabel) {
    $historyFieldsQuery .= ', ' . $consentName . ', ' . $consentName . '_date, ' . $consentName . '_withdrawal';
}
$historyFieldsQuery .= ' FROM consent_info_history';
$consentHistory = $db->pselect($historyFieldsQuery, array());

foreach ($consentHistory as $entry) {
    $candID = $entry['CandID'];
    $pscid = $db->pselectOne(
        'SELECT PSCID FROM candidate WHERE CandID=:cid',
        array ('cid' => $candID)
    );
    $entryStaff = $entry['entry_staff'];
    $entryDate = $entry['data_entry_date'];

    foreach($consent as $consentName=>$consentLabel) {
        if(array_key_exists($consentName, $entry)) {
            $consentStatus = $entry[$consentName];
            $consentDate = $entry[$consentName . '_date'];
            $consentWithdrawal = $entry[$consentName . '_withdrawal'];

            if(!empty($consentStatus) || !empty($consentDate) || !empty($consentWithdrawal)) {
                $formattedHistory = [
                'PSCID'         => $pscid,
                'ConsentName'   => $consentName,
                'ConsentLabel'  => $consentLabel,
                'Status'        => $consentStatus,
                'DateGiven'     => $consentDate,
                'DateWithdrawn' => $consentWithdrawal,
                'EntryStaff'    => $entryStaff,
                'EntryDate'     => $entryDate,
                ];

            }
            //Populate candidate_consent_history table
            $db->insert('candidate_consent_history', $formattedHistory); 
        }
    }
}
echo "\nHistory data insert complete.\n";

///////////////////////////////////////////////////////////
// CREATE SQL FILE TO DROP DEPRECATED TABLES AND COLUMNS //
///////////////////////////////////////////////////////////

$output = "DROP TABLE consent_info_history;\n";
foreach ($existingColumns as $column) {
    $columnName = $column['Column_name'];
    $output .= "ALTER TABLE participant_status DROP COLUMN " . $columnName . ";\n";
}
$filename = __DIR__ . "/../SQL/Cleanup/delete_old_consent_tables.sql";
$fp       = fopen($filename, "w");
fwrite($fp, $output);
fclose($fp);
?>
