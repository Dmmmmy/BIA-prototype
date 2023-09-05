function IdentifyCIA(){
    //window.location.href = "classification.html";
    var table = document.createElement('table');

    // create head
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    var headers = ['Threat Scenario', 'Threat Category', 'Inspect'];

    headers.forEach(function(headerText) {
      var header = document.createElement('th');
      header.appendChild(document.createTextNode(headerText));
      headerRow.appendChild(header);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // create body
    var tbody = document.createElement('tbody');

    var inputField = document.querySelector('#ts');
    var inputValue = inputField.value;     
    var ts = inputValue.split(';').map(item => item.trim());
    localStorage.setItem('tsName', JSON.stringify(ts));
    //console.log(ts);
    //console.log(typeof(ts));

    //const arrayA = ["DoS attack on server", "insider threat of IT department", "malware"];
    const dicCate = {
      "Confidentiality": ["Zero-day attack", "Malware", "Ransomware", "MitM(man in the Middle) attack", "Web-based attack","Social Engineering", "Physical attack", "Eavesdropping", "Disinformation", "Insider threat", "Data breaches", "Cyberfraud", "Phishing"],
      "Integrity": ["Web-based attack for modification", "Physical attack for modification", "Insider threat for modification"],
      "Availability": ["DoS attack", "Botnet", "Unavailability", "shutdown"]
    };

    const categorizedResults = {};

    ts.forEach(item => {
      for (const category in dicCate) {
        if (dicCate.hasOwnProperty(category)) {
          const keywords = dicCate[category];
          const foundKeywords = keywords.filter(keyword => item.toLowerCase().includes(keyword.toLowerCase()));
          
          if (foundKeywords.length > 0) {
            categorizedResults[item] = category;
            break;
          }
        }
      }
    });

    console.log(categorizedResults);


    var data = [
      { threatS: ts[0], category: 'Confidentiality' },
      { threatS: ts[1], category: 'Integrity' },
      { threatS: ts[2], category: 'Availability' }
    ];


    for (const item in categorizedResults) {
      if (categorizedResults.hasOwnProperty(item)) {
        const category = categorizedResults[item];
        var row = document.createElement('tr');
        var sCell = document.createElement('td');
        sCell.appendChild(document.createTextNode(item));
        row.appendChild(sCell);

        var cCell = document.createElement('td');
        cCell.appendChild(document.createTextNode(category));
        row.appendChild(cCell);
        var buttonCell = document.createElement('td');
        var button = document.createElement('button');
        button.textContent = 'Inspect';
        button.onclick = function (){
          if (category === 'Confidentiality')
          {
            var url = 'confidentiality.html?param=' + encodeURIComponent(item);
            window.location.href = url;
          }
          else if (item.category === 'Integrity')
          {
            var url = 'integrity.html?param=' + encodeURIComponent(item);
            window.location.href = url;
          }
          else{
            var url = 'availability.html?param=' + encodeURIComponent(item);
            window.location.href = url;
          }
            
        }
        buttonCell.appendChild(button);
        row.appendChild(buttonCell);

        tbody.appendChild(row);
      }
  
    }

    table.appendChild(tbody);

    var tableContainer = document.getElementById('tableContainer');
    tableContainer.appendChild(table);
    console.log(Object.keys(categorizedResults));
    tsName = Object.keys(categorizedResults);
    localStorage.setItem('homeData', JSON.stringify(categorizedResults));

}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function forAnalyze(){
    //window.location.href = "result.html";
    // Read inputData for threats
  var ts = localStorage.getItem('tsName');
  ts = JSON.parse(ts);
  console.log(ts);
  var overallLoss = [];
  var MTPD = [];
  var tangibleValue = 0;
  var intangibleValue = 0;
  var dayLoss = {};
  for (var i = 0; i<ts.length;i++)
  {
    var [lossN,mtpd,t,it,date_loss] = eachThreat(ts[i]);
    console.log(t);
    console.log(it);
    overallLoss.push(lossN);
    MTPD.push(mtpd);
    tangibleValue+=t;
    intangibleValue+=it;
    dayLoss[ts[i]] = date_loss;
  }
  console.log(tangibleValue);
  console.log(intangibleValue); 

  //generate line chart overview
  console.log(dayLoss);
  let maxLength = 0;
  for (const key in dayLoss) {
    if (dayLoss.hasOwnProperty(key)) {
      const data = dayLoss[key];
      if (data && data.length > maxLength) {
        maxLength = data.length;
      }
    }
  }
  const labels = new Array(maxLength).fill(0).map((_, index) => index );
  const datasets = [];
  for (const key in dayLoss) {
    if (dayLoss.hasOwnProperty(key)) {
      const data = dayLoss[key];
      if (data){
        const dataset = {
          label: key,
          data: data ? data : new Array(labels.length).fill(undefined),
          borderColor: getRandomColor(), 
          fill: false,
        };
        
        datasets.push(dataset);
      }     
    }
  }

  const linechart_data = {
    labels: labels,
    datasets: datasets
  };

  const linechartContainer = document.getElementById('overallTrend');
  const linechartDiv = document.createElement('div');
  linechartDiv.classList.add('chart-container');
  const linechartCanvas = document.createElement('canvas');
  linechartCanvas.width = 400;
  linechartCanvas.height = 400;
  linechartDiv.appendChild(linechartCanvas);
  linechartContainer.appendChild(linechartDiv);
  const line_ctx = linechartCanvas.getContext('2d');
  const myChart = new Chart(line_ctx, {
    type: 'line',
    data: linechart_data,
    options: {
      title: {
        display: true,
        text: 'Persistent Loss Trend Visualization', 
        fontSize: 16,
      },

        
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Year',
          },
          beginAtZero: true
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Loss (million)',
          },
          beginAtZero: true
        },
      },
      
    }
  });


  //generate tangible and intangible pie chart
  const chartContainer = document.getElementById('overallTangible');
  const chartDiv = document.createElement('div');
  chartDiv.classList.add('chart-container');
  const chartCanvas = document.createElement('canvas');
  chartCanvas.width = 100;
  chartCanvas.height = 100;
  chartDiv.appendChild(chartCanvas);
  chartContainer.appendChild(chartDiv);
  const ctx = chartCanvas.getContext('2d');
  var data = {
    labels: ['Tangible Loss', 'Intangible Loss'],
    datasets: [{
      data: [tangibleValue, intangibleValue],
    }]
  };
  var options1 = {
    title: {
      display: true,
      text: 'Tangible and Intangible Loss Visualization',
      fontSize: 18,
    },
  };
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options1,
  });


  //generate prio chart by loss
  overallLoss.sort((a, b) => b[1] - a[1]);
  console.log(overallLoss);
  const threat = overallLoss.map((subArray) => subArray[0]);
  const loss = overallLoss.map((subArray) => subArray[1]);
  var loss_data = {
    labels: threat,
    datasets: [{
      label: 'Loss',
      data: loss,
      backgroundColor: getRandomColor(),
      barThickness: 66,
      //maxBarThickness: 28,
      barPercentage: 0.9,
      categoryPercentage: 1
    }]
  };
  
  var options_prio = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        ticks: {
          font: {
            size: 32,
          }
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          font: {
            size: 36, 
          }
        }
      },
    },
    indexAxis: 'y', // Set the index axis to 'y' for horizontal bar chart
  };
  
  const prioContainer = document.getElementById('prioritization');
  const chartCanvas1 = document.createElement('canvas');
  chartCanvas1.width = 400;
  chartCanvas1.height = 400;
  prioContainer.appendChild(chartCanvas1);
  const ctx1 = chartCanvas1.getContext('2d');
  const prioByLoss = new Chart(ctx1, {
    type: 'bar',
    data: loss_data,
    options:options_prio
  });
  

  //generate prio chart by mMTPD
  var combinedArray = ts.map((element, index) => ({ value1: element, value2: MTPD[index] }));
  combinedArray.sort((a, b) => a.value2 - b.value2);
  var sortedArr1 = combinedArray.map((item) => item.value1);  
  var sortedArr2 = combinedArray.map((item) => item.value2);
  var mtpd_data = {
    labels: sortedArr1,
    datasets: [{
      label: 'MTPD',
      data: sortedArr2,
      backgroundColor: getRandomColor(),
      barThickness: 66,
      barPercentage: 0.9,
    }]
  };
  const chartCanvas2 = document.createElement('canvas');
  chartCanvas2.width = 400;
  chartCanvas2.height = 400;
  prioContainer.appendChild(chartCanvas2);
  const ctx2 = chartCanvas2.getContext('2d');
  const prioByMTPD = new Chart(ctx2, {
    type: 'bar',
    data: mtpd_data,
    options: options_prio,
  });
  
}

function eachThreat(threatName){
  var threat1Data = JSON.parse(localStorage.getItem(threatName));
  console.log(threat1Data);
  var name = threat1Data['id'];
  var mtpd = threat1Data['MTPD'];
  var onetimeBI = threat1Data['onetimeBI'];
  var BIlabel = Object.keys(onetimeBI);
  var BIvalue = Object.values(onetimeBI);

  var persistentBI = threat1Data['persistentBI'];
  var pBIName = [];
  let totalLoss = 0;
  var pBIRealvalue = [];
  var date_loss  = [];
  for (var key in persistentBI){
    if (persistentBI.hasOwnProperty(key)){
      pBIName.push(key);
      var pBI = persistentBI[key];
      var pBIvalue = pBI['persistentBIValue'];
      var rp = pBI['rp'];
      console.log(rp);
      var recovery = [];
      var days = [];
      rp.forEach((row) => {
        recovery.push(row.column1);
        days.push(row.column2);
      });
      //console.log(recovery); // 
      //console.log(days); // 
      //console.log(Object.keys(pBI));
      
      //var pBIlabel = Object.keys(pBI);
      //var pBIvalue = Object.values(pBI);
      //console.log(pBIvalue);

      //Calculate everyday loss for line chart      
      var rDays = days.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      var lossValues = new Array(rDays).fill(0);
      let currentDay = 0;
      rp.forEach(({ column1, column2 }) => {
        for (let day = 1; day <= column2; day++) {
          lossValues[currentDay] = (1-column1)*pBIvalue;
          currentDay++;
        }
      });
      //console.log(lossValues);
      date_loss.push(lossValues);     
      //console.log(date_loss);   
      

      // Calculate the first part of the formula (Σᵢ(Σₜ(BI_persistent,ᵢ * (1 - recovery) * daysₜ)))      
      let persistentSum = 0;

      for (let t = 0; t < days.length; t++) {
        persistentSum += pBIvalue * (1 - recovery[t]) * days[t];
      }
      totalLoss += persistentSum;
      console.log(persistentSum);
      pBIRealvalue.push(persistentSum);
    }
    
  }
  //Calculate everyday loss for line chart
  //console.log(date_loss);
  if (date_loss.length!==0){
    var maxLength = Math.max(...date_loss.map(array => array.length));
    var result = new Array(maxLength+1).fill(0);
    for (var i = 0; i < maxLength; i++) {
      for (const array of date_loss) {
        if (array[i] !== undefined) {
          
          result[i] += array[i];
        }
      }
    }
  var newResult = [...result]; 
  newResult.unshift(result[0]);
  console.log(newResult); 

  }
  
  //console.log(totalLoss);
  for (let j = 0; j < BIvalue.length; j++) {
    //console.log(BIvalue[j]);
    v = Number(BIvalue[j]);//convert str to int
    totalLoss += v;
  }
  //console.log(totalLoss);

  //determine tangible or intangible
  pBIName.forEach((element) => {
    BIlabel.push(element);
  });
  pBIRealvalue.forEach((element) => {
    BIvalue.push(element);
  });
  var label_value = [];
  for (let i=0; i<BIlabel.length; i++){
    label_value.push([BIlabel[i],BIvalue[i]]);
  }
  console.log(label_value);
  //console.log(BIlabel);
  //console.log(pBIRealvalue);

  // tangible and intangible overview
  intangible_keyword = ["debt", "relationships", "contract", "premium"];
  intangibleBI = 0;
  tangibleBI = 0;
  var storedData = localStorage.getItem('data');
  storedData = JSON.parse(storedData);
  for (var i=0; i<BIlabel.length; i++){
    var filteredElements = storedData.filter(item => item.input === BIlabel[i]);
    if (intangible_keyword.some(keyword => BIlabel[i].includes(keyword))){
      var y = JSON.parse(BIvalue[i]);
      intangibleBI+=y;
   
    }
    else if (filteredElements.length !== 0){
      f = filteredElements[0];
      //console.log(f);
      //console.log(typeof(f));
      att = f['attribute'];      
      if(att[1] === 'tan'){
        var y = JSON.parse(BIvalue[i]);
        tangibleBI+=y;
      }
      else{
        var y = JSON.parse(BIvalue[i]);
        intangibleBI+=y;
      }
    }
    else{
      x = JSON.parse(BIvalue[i]);
      tangibleBI += x;
      //console.log(BIvalue[i]);
    }
  }
  console.log(tangibleBI);

  //show individual pie chart
  const chartContainer = document.getElementById('eachThreat');
  const chartDiv = document.createElement('div');
  chartDiv.classList.add('chart-container');
  const chartCanvas = document.createElement('canvas');
  chartCanvas.width = 400;
  chartCanvas.height = 400;
  chartDiv.appendChild(chartCanvas);
  chartContainer.appendChild(chartDiv);
  const ctx = chartCanvas.getContext('2d');
  var data = {
    labels: BIlabel,
    datasets: [{
      data: BIvalue,
    }]
  };
  var options = {
    plugins: {
      title: {
        display: true,
        text: name,
        fontSize: 26,
      }
    } 
  };
  var myPieChart = new Chart(ctx, {
    type: 'pie',
    data: data,
    options: options,
  });

  return [[name, totalLoss], mtpd, tangibleBI, intangibleBI,newResult];
}

function showTable(){
  //localStorage.removeItem("homeData");
  var categorizedResults = localStorage.getItem('homeData');
  categorizedResults = JSON.parse(categorizedResults);
  var table = document.createElement('table');
  /*
  var thead = document.createElement('thead');
  var headerRow = document.createElement('tr');
  var headers = ['Threat Scenario', 'Threat Category', 'Inspect'];

  headers.forEach(function(headerText) {
    var header = document.createElement('th');
    header.appendChild(document.createTextNode(headerText));
    headerRow.appendChild(header);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);
  */
  var tbody = document.createElement('tbody');
  for (const item in categorizedResults) {
    if (categorizedResults.hasOwnProperty(item)) {
      const category = categorizedResults[item];
      var row = document.createElement('tr');
      var sCell = document.createElement('td');
      sCell.appendChild(document.createTextNode(item));
      row.appendChild(sCell);

      var cCell = document.createElement('td');
      cCell.appendChild(document.createTextNode(category));
      row.appendChild(cCell);
      var buttonCell = document.createElement('td');
      var button = document.createElement('button');
      button.textContent = 'Inspect';
      button.onclick = function (){
        if (category === 'Confidentiality')
        {
          var url = 'confidentiality.html?param=' + encodeURIComponent(item);
          window.location.href = url;
        }
        else if (item.category === 'Integrity')
        {
          var url = 'integrity.html?param=' + encodeURIComponent(item);
          window.location.href = url;
        }
        else{
          var url = 'availability.html?param=' + encodeURIComponent(item);
          window.location.href = url;
        }
          
      }
      buttonCell.appendChild(button);
      row.appendChild(buttonCell);

      tbody.appendChild(row);
    }

  }

  table.appendChild(tbody);

  var tableContainer = document.getElementById('tableContainer');
  tableContainer.appendChild(table);
  
}

/*
document.addEventListener('DOMContentLoaded', function() {
  const storedData = localStorage.getItem('homeData');
  if (storedData) {
    const { tableData, fixedInputContent } = JSON.parse(storedData);
    console.log(fixedInputContent);
    // re-generate table
    IdentifyCIA();   
    //fulfill input threats
    const fixedInput = document.getElementById('ts');
    fixedInput.value = fixedInputContent;
  }
});
*/

function clearTable() {
  var tableContainer = document.getElementById('tableContainer');
  tableContainer.innerHTML = '';
}
window.addEventListener('beforeunload', clearTable);
window.addEventListener('DOMContentLoaded', showTable);
