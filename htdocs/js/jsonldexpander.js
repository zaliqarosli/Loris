const jsonld = require('jsonld');

export default async function expandFull(schemaURI) {
  const expanded = await jsonld.expand(schemaURI);
  const schema = expanded[0];
  // By item, we mean any subactivity or field
  const itemList = await getItems(schema);
  let pages = [];
  let sections = [];
  let multiparts = [];
  let tables = [];
  let fields = [];

  sortItems(itemList, pages, sections, multiparts, tables, fields);

  return {schema, pages, sections, multiparts, tables, fields};
}

function sortItems(itemList, pages, sections, multiparts, tables, fields) {
  itemList.forEach(async (schema) => {
    switch (schema['https://schema.repronim.org/inputType'][0]['@value']) {
      case 'page':
        pages.push(schema);
        break;
      case 'section':
        sections.push(schema);
        break;
      case 'multipart':
        multiparts.push(schema);
        break;
      case 'table':
        tables.push(schema);
        break;
      default:
        // For leftover case i.e. fields
        if (schema['@type'][0] === 'https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Field.jsonld') {
          fields.push(schema);
        }
    }
    if (hasItems(schema)) {
      const newItemList = await getItems(schema);
      sortItems(newItemList, pages, sections, multiparts, tables, fields);
    }
  });
}

function hasItems(schema) {
  if (schema['https://schema.repronim.org/order']) {
    return true;
  }
  return false;
}

// Given a jsonld schema, this function returns the schema of all items in the order list
async function getItems(schema) {
  const orderList = schema['https://schema.repronim.org/order'][0]['@list'];
  let schemaList = [];
  const promises = orderList.map((uriObject, key) => {
    const uri = uriObject['@id'];
    return getSchemaByUri(uri);
  });
  schemaList = await Promise.all(promises).then((result) => {
    return result;
  });
  return schemaList;
}

async function getSchemaByUri(uri) {
  let expanded = {};
  try {
    expanded = await jsonld.expand(uri);
  } catch (error) {
    console.error('Expanding URI ' + uri + ' failed.');
    console.error(error);
  }
  return expanded[0];
}

// function map_json_to_alias() {
//
// }
//
// function expand_fully_alias() {
//
// }
