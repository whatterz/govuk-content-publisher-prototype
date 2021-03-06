const path = require('path');
const fs = require('fs');

const pathPrefixes = require('../data/document_type_path_prefixes.json');
const documentSchemas = require('../data/document_type_schemas.json');

exports.findDocumentSchemaByType = function(type) {
  if (!type) return null
  let item = documentSchemas.find( ({ document_type }) => document_type === type );
  return item.document_schema;
}

exports.findPathPrefixByType = function(type) {
  if (!type) return null
  let item = pathPrefixes.find( ({ document_type }) => document_type === type );
  return item.path_prefix;
}

exports.paginate = function(array, page_size, page_number) {
  --page_number; // because pages logically start with 1, but technically with 0
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
};

exports.slugify = function(text) {
  if (!text)
    return null;
  return text.toLowerCase()
          .replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
          .replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
          .replace(/^-+|-+$/g, ''); // remove leading, trailing -
};

exports.deleteDirectoryRecursive = function(directoryPath) {
  if (!directoryPath)
    return null;

  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach((file, index) => {
      const curDirPath = path.join(directoryPath, file);
      if (fs.lstatSync(curDirPath).isDirectory()) { // recurse
        this.deleteFolderRecursive(curDirPath);
      } else { // delete file
        fs.unlinkSync(curDirPath);
      }
    });
    fs.rmdirSync(directoryPath);
  }
};
