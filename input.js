function addRow(table) {
    //var table = document.getElementById("myTable");
    var newRow = table.insertRow();
    
    var cell1 = newRow.insertCell();
    var cell2 = newRow.insertCell();
    
    cell1.innerHTML = '<input type="text" />';
    cell2.innerHTML = '<input type="text" />';
}

function back2home(){
    window.location.href = 'home.html';
  }


/*
  function getSelectedCheckboxesFromLocalStorage() {
    var selectedCheckboxes = localStorage.getItem('selectedCheckboxes');
    return JSON.parse(selectedCheckboxes);
  }
  */

// display threat name
function showName(){
  //get threat name by URL
  var threat = document.getElementById('threatname');
  var queryString = window.location.search;
  var searchParams = parseQueryString(queryString);
  var name = searchParams['data'];
  //console.log(name);
  var threatName = this.document.createElement('mark');
  threatName.textContent = name;
  threat.appendChild(threatName);
}
// show selected BI
function showSelectedBI() {
  var persistentContainer = document.getElementById('persistentContainer');
  var oneTimeContainer = document.getElementById('one-timeContainer');
  var selectedBI = JSON.parse(localStorage.getItem('selectedCheckboxes'));
  var newBI = localStorage.getItem('data');
  console.log(selectedBI);
      
  if (selectedBI) {
    //var selectedCheckboxes = JSON.parse(dataParam);
    //console.log(selectedBI);

    selectedBI.forEach(function(checkbox) {
      //console.log(checkbox.id);
      var labelElement = document.createElement('label');
      labelElement.textContent = checkbox.label;
      labelElement.classList.add('dynamic-label');

      var inputElement = document.createElement('input');
      inputElement.type = 'text';
      inputElement.classList.add('dynamic-input'); // to identify BI


      // classify one-time or persistent by id
      if (checkbox.id === 'qualDeg' || checkbox.id === 'lc' || checkbox.id === 'lr' || checkbox.id == 'lostSale' || checkbox.id == 'debt' || checkbox.id.includes('per')) {
        persistentContainer.appendChild(labelElement);
        persistentContainer.appendChild(inputElement);
        persistentContainer.appendChild(document.createElement('br'));

        // Add corresponding recovery table
        const table = document.createElement('table');
        table.classList.add('dynamic-table');
        const headerRow = table.insertRow();
        const headerCell1 = headerRow.insertCell(0);
        const headerCell2 = headerRow.insertCell(1);
        headerCell1.textContent = 'Recovery Level';
        headerCell2.textContent = 'Timeframe';      
        const initialRow = table.insertRow();
        const cell1 = initialRow.insertCell(0);
        const cell2 = initialRow.insertCell(1);
        cell1.innerHTML = '<input type="text" />';
        cell2.innerHTML = '<input type="text" />';
        //cell1.textContent = '0.4';
        //cell2.textContent = '3';
        //console.log("add table");
        const btn = document.createElement('button');
        btn.textContent = 'Add Row';
        btn.addEventListener('click', () => {
          addRow(table);
        });

        persistentContainer.appendChild(table);
        persistentContainer.appendChild(btn);
        
      } 
      else {
        oneTimeContainer.appendChild(labelElement);
        oneTimeContainer.appendChild(inputElement);
        oneTimeContainer.appendChild(document.createElement('br'));
      }

      //collect tangible and intangible
      /*var tangibleBI = {};
      if (checkbox.id === 'lostSale' || checkbox.id === 'vioTime' || checkbox.id === 'qualDeg' || checkbox.id === 'ti' || checkbox.id === 'ci' || checkbox.id === 'vioCon'|| checkbox.id === 'breachNot'|| checkbox.id === 'postPro'|| checkbox.id === 'lostIP'|| checkbox.id === 'pucRe'|| checkbox.id === 'damage'|| checkbox.id === 'vioStandard'|| checkbox.id === 'vioInt'){
        tangibleBI[checkbox.label] =
      }*/
    });
  }
  /*
  if (labelsParam) {
    var selectedLabels = JSON.parse(labelsParam);
    selectedLabels.forEach(function(label) {
      var labelElement = document.createElement('label');
      labelElement.textContent = label;
      selectedLabelsContainer.appendChild(labelElement);

      var inputElement = document.createElement('input');
      inputElement.type = 'text';
      selectedLabelsContainer.appendChild(inputElement);

      selectedLabelsContainer.appendChild(document.createElement('br'));


    });
  }*/
}

function parseQueryString(queryString) {
  var params = {};
  var pairs = queryString.substring(1).split('&');

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1] || '');
    params[key] = value;
  }
  return params;
}

function save(){
  //get threat name by URL
  //var threat = document.getElementById('threatname');
  var queryString = window.location.search;
  var searchParams = parseQueryString(queryString);
  var name = searchParams['data'];

  //Save all inputs together with the threat name to localstorage
  var currency = document.getElementById('Currency').value;
  var MTPD = document.getElementById('mtpd').value;

  // collect one-time BI input
  var onetimeBIContainer = document.getElementById('one-timeContainer');
  var onetimeBI = onetimeBIContainer.querySelectorAll('.dynamic-input');
  var onetimeBIValue = {};
  var onetimeBIlabels = onetimeBIContainer.querySelectorAll('.dynamic-label');
  for (var i = 0; i < onetimeBIlabels.length; i++) {
    var label = onetimeBIlabels[i].textContent;
    var value = onetimeBI[i].value;
    onetimeBIValue[label] = value;
  }
  
  console.log(onetimeBIValue);

  //collect persistent BI input
  var persistentBIContainer = document.getElementById('persistentContainer');
  var persistentBI = persistentBIContainer.querySelectorAll('.dynamic-input');
  var persistentBIlabels = persistentBIContainer.querySelectorAll('.dynamic-label');
  var persistentBItable = persistentBIContainer.querySelectorAll('.dynamic-table');
  var persistentBIValue = {};
  for (var i = 0; i < persistentBIlabels.length; i++) {
    var label = persistentBIlabels[i].textContent;
    var value = persistentBI[i].value;
    //get table content
    var tableData = [];
    var tableRows = persistentBItable[i].querySelectorAll('tr');
    for (var j = 1; j < tableRows.length; j++) {
      var rowData = {};
      var cells = tableRows[j].querySelectorAll('td input');
      rowData.column1 = cells[0].value;
      rowData.column2 = cells[1].value;
      tableData.push(rowData);
    }
    var persistentData = {
      persistentBIValue: value,
      rp: tableData,
    };
    persistentBIValue[label] = persistentData;

  }
  console.log(persistentBIValue);
  
  

  // combine all inputs
  var inputData = {
    id: name,
    currency: currency,
    MTPD: MTPD,
    onetimeBI: onetimeBIValue,
    persistentBI: persistentBIValue,
  };
  console.log(inputData);
  // to LocalStorage
  localStorage.setItem(name, JSON.stringify(inputData));
  alert('saved!');
}

window.addEventListener('load', showSelectedBI);
window.addEventListener('load', showName);


/*
function showChosenBI(){
  var biContainer = document.getElementById('BIContainer');

  window.addEventListener('load', function() {
    var allKeys = Object.keys(localStorage);
    var labels = [];

    allKeys.forEach(function(key) {
      if (key.startsWith('checkbox_')) {
        var checkboxId = key;
        var isChecked = localStorage.getItem(checkboxId) === 'true';
        var label = localStorage.getItem('label_' + checkboxId);

        if (isChecked) {
          labels.push(label);
        }
      }
    });
    //Display chosen BI 
    labels.forEach(function(label) {
      var labelElement = document.createElement('label');
      labelElement.textContent = label;

      var inputElement = document.createElement('input');
      inputElement.type = 'text';

      biContainer.appendChild(labelElement);
      biContainer.appendChild(inputElement);
      biContainer.appendChild(document.createElement('br'));
    });
  });
}
*/