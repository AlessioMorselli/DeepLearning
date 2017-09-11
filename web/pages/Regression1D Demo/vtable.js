/**
 * Funzioni per rendere l'inserimento e il recupero
 * di elementi in colonna in un table più semplice
 */


function addColumn(table) {
  var thead = getTableHead(table);
  thead.children[0].innerHTML += "<td></td>";

  var tbody = getTableBody(table);
  for(var i=0; i<tbody.children.length; i++) {
    tbody.children[i].innerHTML += "<td></td>";
  }
}

function addRow(table) {
  var tbody = getTableBody(table);
  var row = tbody.appendChild(document.createElement("tr"));
  for(var i=0; i<getNumberColumns(table); i++) {
    if(i===0) row.innerHTML += "<td style='width:120px;'></td>";
    else row.innerHTML += "<td></td>";
  }
}

function setColumnHeader(table, innerHTML, column) {
  var thead = getTableHead(table);
  // thead -> tr -> th
  thead.children[0].children[column].innerHTML = innerHTML;
}

function push(table, element, column) {
  var tbody = getTableBody(table);

  for(var i=0; i<tbody.children.length; i++) {
    if(isCellEmpty(table, i, column)) {
      getCell(table, i, column).appendChild(element);
      return;
    }
  }
  addRow(table);
  push(table, element, column);
}

function pop(table, column) {
  var tbody = getTableBody(table);
  
  for(var i=0; i<tbody.children.length; i++) {
    getCell(table, getColumn(table, column).length-1, column).innerHTML = "";
  }
}

function getColumn(table, col) {
  var column = [];
  var tbody = getTableBody(table);
  for(var i=0; i<tbody.children.length; i++) {
    if(!isCellEmpty(table, i, col)) {
      column.push(getCell(table, i, col).children[0]);
    }
  }
  return column;
}

function getCells(table) {
  var cells = [];
  for(var i=0; i<getNumberColumns(table); i++) {
    cells.push(getColumn(table, i));
  }
  return cells;
}

function getCell(table, i, column) {
  var tbody = getTableBody(table);
  var row = tbody.children[i];
  var td = row.children[column];
  return td;
}

function getNumberColumns(table) {
  return getTableHead(table).children[0].children.length;
}

function isCellEmpty(table, row, column) {
  var tbody = getTableBody(table);
  var row = tbody.children[row];
  var td = row.children[column];
  return (td.children.length === 0);
}

function getTableBody(table) {
  return table.tBodies[0];
}

function getTableHead(table) {
  return table.tHead;
}

