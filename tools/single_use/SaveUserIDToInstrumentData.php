<?php
/**
 * This script is intended for a one-time use only to restore the value of the
 * `UserID` column of instrument tables and the `UserID` key of the instrument
 * JSON `Data` in the flag table.
 *
 * This tool queries data from the `history` table and meaningfully imports
 * data from its `userID` column back into the instrument and `flag` tables.
 *
 * Example use:
 * $ php SaveUserIDToInstrumentData.php [confirm]

 * PHP Version 7
 *
 * @category Tools
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @licence  LORIS License
 * @link     https://www.github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

$confirm = false;
if (isset($argv[1]) && $argv[1] === 'confirm') {
    $confirm = true;
}

echo "\n\nQuerying data...\n\n";

// Get history DB
$DBInfo = $config->getSetting('database');
$hDB = isset($DBInfo['historydb']) ? $DBInfo['historydb'] : $DBInfo['database'];

$result_count = 1;
// Query entries in the history table for the latest change
// made to the Data column of the flag table, for every CommentID.
$history = $DB->pselect(
    "SELECT DISTINCT f.Test_name,f.CommentID, h.userID, changedate
   FROM flag f
        JOIN history h ON (f.CommentID=h.primaryVals)
        JOIN (SELECT primaryVals, MAX(changedate) as changedate
              FROM $hDB.history
              WHERE primaryCols = 'CommentID'
                AND userID <> 'unknown'
              GROUP BY primaryVals) h_tmp USING(primaryVals,changedate)",
    array()
);
// Loop and index results from history by testname.
$idxHist = [];
foreach($history as $entry) {
    $idxHist[$entry['Test_name']][] = $entry;
}

foreach(\Utility::getAllInstruments() as $testname => $fullName) {

    // Instantiate instrument object to get information
    try {
        $instrument = NDB_BVL_Instrument::factory($testname, "", "");
    } catch (Exception $e) {
        echo "$testname does not seem to be a valid instrument.\n";
        continue;
    }

    // Check if instrument saves dat in JSON format (no-SQL table)
    $JSONData = $instrument->usesJSONData();
    $table = null;
    if ($JSONData === false) {
        $table = $instrument->table;
        if (!$DB->tableExists($table)) {
            echo "Table $table for instrument $testname does not exist in the Database\n";
            continue;
        }
    }
    
    if (empty($idxHist[$testname])) {
        echo "There is no data to import into $testname.\n";
        continue;
    } else {
        echo "The following data can be imported into $testname:\n";
        foreach ($idxHist[$testname] as $row) {
            echo "\tResult $result_count: $row[CommentID] user: $row[userID]\n";
            $result_count++;
        }
    }

    // Update the instrument table
    if ($confirm) {

        echo "\n\nImporting data into $testname...\n";
        $testname_query = "UPDATE $testname
            LEFT JOIN flag f USING (CommentID)
            LEFT JOIN history h1 ON (f.CommentID=h1.primaryVals)
            LEFT JOIN
            (
                SELECT primaryVals, MAX(changeDate) AS max_date
                    FROM history
                    WHERE tbl = 'flag'
                        AND col = 'Data'
                        AND userID <> 'unknown'
                    GROUP BY primaryVals
            ) h2 USING (primaryVals)
            SET $testname.UserID = h1.userID
                WHERE h1.tbl = 'flag'
                    AND h1.col = 'Data'
                    AND h1.userID <> 'unknown'
                    AND h1.changeDate = h2.max_date
                    AND $testname.UserID IS NULL";

        $flag_query = "UPDATE flag f
            LEFT JOIN $testname USING (CommentID)
            LEFT JOIN history h1 ON (f.CommentID=h1.primaryVals)
            LEFT JOIN
            (
                SELECT primaryVals, MAX(changeDate) AS max_date
                    FROM history
                    WHERE tbl = 'flag'
                        AND col = 'Data'
                        AND userID <> 'unknown'
                    GROUP BY primaryVals
            ) h2 USING (primaryVals)
            SET f.Data = JSON_MERGE_PATCH(
                f.Data, CONCAT('{\"UserID\": \"', h1.userID, '\"}')
            )
                WHERE h1.tbl = 'flag'
                    AND h1.col = 'Data'
                    AND h1.userID <> 'unknown'
                    AND h1.changeDate = h2.max_date
                    AND $testname.UserID IS NULL";

        $stmt_table = $DB->prepare($testname_query);
        $stmt_flag  = $DB->prepare($flag_query);
        try {
            $DB->beginTransaction();
            $stmt_table->execute();
            $stmt_flag->execute();
            $DB->commit();
            echo "\n\nData import done for $testname.\n";
        } catch (Exception $e) {
            $DB->rollBack();
            print("$testname was not updated.");
            print($e->getMessage());
        }
    }
}

if (!$confirm) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
         "perform the changes.\n";
}
