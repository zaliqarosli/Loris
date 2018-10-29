/**
 * Modify behaviour of specified column cells in the Data Table component
 * @param {string} column - column name
 * @param {string} cell - cell content
 * @param {array} rowData - array of cell contents for a specific row
 * @param {array} rowHeaders - array of table headers (column names)
 * @return {*} a formated table cell for a given column
 */
function formatColumn(column, cell, rowData, rowHeaders) {
  // If a column if set as hidden, don't display it
  if (loris.hiddenHeaders.indexOf(column) > -1) {
    return null;
  }

  // Create the mapping between rowHeaders and rowData in a row object.
  let row = {};
  rowHeaders.forEach(function(header, index) {
    row[header] = rowData[index];
  }, this);

  // create array of classes to be added to td tag
  let classes = [];
  if (row['Hide File'] === '1') {
    classes.push('bg-danger');
  }
  // convert array to string, with blank space separator
  classes = classes.join(' ');

  const hasWritePermission = loris.userHasPermission('media_write');
  if (column === 'File Name' && hasWritePermission === true) {
    let downloadURL = loris.BaseURL + '/media/ajax/FileDownload.php?File=' + encodeURIComponent(row['File Name']);
    return (
      <td className= {classes}>
        <a href={downloadURL} target="_blank" download={row['File Name']}>
          {cell}
        </a>
      </td>
    );
  }

  if (column === 'Visit Label') {
    if (row['Cand ID'] !== null && row['Session ID']) {
      let sessionURL = loris.BaseURL + '/instrument_list/?candID=' +
        row['Cand ID'] + '&sessionID=' + row['Session ID'];
      return <td className={classes}><a href={sessionURL}>{cell}</a></td>;
    }
  }

  if (column === 'Edit Metadata') {
    let editURL = loris.BaseURL + '/media/edit/?id=' + row['Edit Metadata'];
    return <td className={classes}><a href={editURL}>Edit</a></td>;
  }

  return <td className={classes}>{cell}</td>;
}

export default formatColumn;