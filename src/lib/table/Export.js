/*
 * Some common data export related code.
 */


const toCSV = function(data, structure, ignoreHidden) {
  if (!data) {
    return null;
  }
  let header = '';
  let sheetContent = '';
  structure.columns.forEach(function(column, index, list) {
    if (!ignoreHidden && !column.hidden) {
      header = header + column.label + ",";
    }
  });
  //get rid of last comma
  header = header.substr(0, header.length - 1) + "\n";
  let _csv = "";
  for(const model of data) {
    _csv = "";
    for(const column of structure.columns){
      if (!ignoreHidden && !column.hidden) {
        if(model[column.attr]){
          _csv = _csv + '"'  + model[column.attr] + '"' + ',';
        }
      }
    }
    sheetContent = sheetContent + _csv + '\n';
  }

  return header + sheetContent;
}

const toXML = function(data, structure, ignoreHidden) {
  let _xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + '<models>\n';
  let _xmlTemplate = (obj, attr) => `\t<${attr}>${obj[attr]}</${attr}>\n`;
  let _xmlContent = '';
  let _model = '';

  for(const model of data) {
    _model = '<model>\n';
    for(const column of structure.columns){
      if (!ignoreHidden && !column.hidden) {
        if(model[column.attr]){
          _model = _model + _xmlTemplate(model, column.attr);
        }
      }
    }
    _model = _model + '</model>\n';

    _xmlContent = _xmlContent + _model;

  }

  _xml = _xml + _xmlContent +  '\n</models>';

  return _xml;
}

const toJSON = function(data, structure, ignoreHidden) {
  if (!data) {
    return null;
  }
  return JSON.stringify(data, null, 2);
}

const translate = function(type, data, structure, ignoreHidden) {
  if(type === 'CSV'){
    return toCSV(data, structure, ignoreHidden);
  } else if(type === 'XML'){
    return toXML(data, structure, ignoreHidden);
  } else {
    return toJSON(data, structure, ignoreHidden);
  }
}

export default {
  triggerDownload(name='fe-table', type, data, structure, ignoreHidden) {
    const stamp = new Date().getTime();
    let fileType, _txt, blob, url, _a;

    if (type === "csv") {
      fileType = "text/csv;charset=UTF-8";
    } else {
      fileType = "text/plain;charset=UTF-8";
    }

    const fileName = name + '-' + stamp + "." + type;

    _txt = translate(type, data, structure, ignoreHidden);

    blob = new Blob([_txt], {
      type: fileType
    });

    if (blob) {
      url = window.URL.createObjectURL(blob);
      _a = document.createElement("a");
      document.body.appendChild(_a);
      _a.style.display = "none";
      _a.href = url;
      _a.download = fileName;
      _a.click();
      setTimeout(function() {
        window.URL.revokeObjectURL(url);
        _a.remove();
      }, 30);
    }

  }
};
