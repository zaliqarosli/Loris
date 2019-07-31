const jsonld = require('jsonld');

export default async function expandFull(schemaURI) {
  try {
    const expanded = await jsonld.expand(schemaURI);
    const schema = expanded[0];
    // By item, we mean any subactivity or field
    const itemList = await getItems(schema);
    let pages = [];
    let sections = [];
    let multiparts = [];
    let tables = [];
    let fields = [];
    let valueconstraints = [];

    sortItems(itemList, pages, sections, multiparts, tables, fields, valueconstraints);

    return {schema, pages, sections, multiparts, tables, fields, valueconstraints};
  } catch (error) {
    console.error('Error full expanding.');
    console.error(error);
  }
}

function sortItems(itemList, pages, sections, multiparts, tables, fields, valueconstraints) {
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
          if (hasValueConstraints(schema)) {
            const valueSchema = await getValueConstraints(schema);
            schema['https://schema.repronim.org/valueconstraints'] = [...valueSchema];
          }
          fields.push(schema);
        }
    }
    if (hasItems(schema)) {
      const newItemList = await getItems(schema);
      sortItems(newItemList, pages, sections, multiparts, tables, fields, valueconstraints);
    }
  });
}

function hasItems(schema) {
  if (schema['https://schema.repronim.org/order']) {
    return true;
  }
  return false;
}

function hasValueConstraints(schema) {
  if ((schema['https://schema.repronim.org/valueconstraints'][0]).hasOwnProperty('@id')) {
    return true;
  }
  return false;
}

// Given a jsonld schema, this function returns the schema of all items in the order list
async function getItems(schema) {
  try {
    const orderList = schema['https://schema.repronim.org/order'][0]['@list'];
    const promises = orderList.map((uriObject, key) => {
      const uri = uriObject['@id'];
      return getSchemaByUri(uri);
    });
    return await Promise.all(promises).then((result) => {
      return result;
    });
  } catch (error) {
    console.error('Error getting items.');
    console.error(error);
  }
}

// Returns schema of valueconstraint uri in given schema
async function getValueConstraints(schema) {
  try {
    const promises = schema['https://schema.repronim.org/valueconstraints'].map((uriObject, key) => {
      const uri = uriObject['@id'];
      return getSchemaByUri(uri);
    });
    return await Promise.all(promises).then((result) => {
        return result;
    });
  } catch (error) {
    console.error('Error getting value constraints.');
    console.error(error);
  }
}

async function getSchemaByUri(uri) {
  try {
    const expanded = await jsonld.expand(uri);
    return expanded[0];
  } catch (error) {
    console.error('Expanding URI ' + uri + ' failed.');
    console.error(error);
  }
}
