const jsonld = require('jsonld');

const expandFull = async (schemaURI) => {
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
};

const sortItems = async (itemList, pages, sections, multiparts, tables, fields, valueconstraints) => {
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
        if (schema['@type'][0] === 'https://raw.githubusercontent.com/ReproNim/schema-standardization/master/schemas/Field') {
          if (hasURIValueConstraints(schema)) {
            const valueSchema = await getValueConstraints(schema);
            schema['https://schema.repronim.org/valueconstraints'] = [...valueSchema];
          } else if (hasDirectValueConstraints(schema)) {
            // TODO: deal with when value constraint is an object, not a URI
          } else {
            // TODO: deal with when value constraint doesn't exist i.e. for a header element
            if (schema['https://schema.repronim.org/inputType'][0]['@value'] === 'header') {
               schema['https://schema.repronim.org/valueconstraints'] = null;
            } else {
              // TODO: return error
            }
          }
          fields.push(schema);
        }
    }
    if (hasItems(schema)) {
      const newItemList = await getItems(schema);
      sortItems(newItemList, pages, sections, multiparts, tables, fields, valueconstraints);
    }
  });
};

const hasItems = (schema) => {
  if (schema['https://schema.repronim.org/order']) {
    return true;
  }
  return false;
};

const hasURIValueConstraints = (schema) => {
  if (schema['https://schema.repronim.org/valueconstraints'] && (schema['https://schema.repronim.org/valueconstraints'][0]).hasOwnProperty('@id')) {
    return true;
  }
  return false;
};

const hasDirectValueConstraints = (schema) => {
  if (schema['https://schema.repronim.org/valueconstraints'] && !((schema['https://schema.repronim.org/valueconstraints'][0]).hasOwnProperty('@id'))) {
    return true;
  }
  return false;
};

// Given a jsonld schema, this function returns the schema of all items in the order list
const getItems = async (schema) => {
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
};

// Returns schema of valueconstraint uri in given schema
const getValueConstraints = async (schema) => {
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
};

const getSchemaByUri = async (uri) => {
  try {
    const expanded = await jsonld.expand(uri);
    return expanded[0];
  } catch (error) {
    console.error('Expanding URI ' + uri + ' failed.');
    console.error(error);
  }
};

const JsonLDExpander = {
  expandFull: expandFull,
};

export default JsonLDExpander;
