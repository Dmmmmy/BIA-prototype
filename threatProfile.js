
var newBI = []
function addNewBI(){
    var inputField = document.getElementById('BIInput');
    var inputValue = inputField.value.trim();
    //var inputValue = inputField.value;
    newBI.push(inputValue);
    //var contentContainer = document.getElementById('newBIContainer');
    //var newContent = document.createElement('p');
    //newContent.textContent = inputValue;
    var timeselectValue = document.getElementById('timeAttribute');
    var timeselectData = timeselectValue.value;
    var tanselectValue = document.getElementById('tanAttribute');
    var tanselectData = tanselectValue.value;
    //var createCheckboxBtn = document.getElementById('addBI');
    var checkboxContainer = document.getElementById('newBI');

        if (inputValue) {
          var checkboxDiv = document.createElement('div');
          checkboxDiv.className = 'checkbox-container';
          
          var checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = inputValue+timeselectData+tanselectData;
          console.log(checkbox.id);
          
          var label = document.createElement('label');
          label.textContent = inputValue;
          
          checkboxDiv.appendChild(checkbox);
          checkboxDiv.appendChild(label);
          
          checkboxContainer.appendChild(checkboxDiv);
  
          // 清空输入框内容
          inputField.value = '';
        }


    //contentContainer.appendChild(newContent);
    
    var storedContent = localStorage.getItem('storedContent') || '';
    storedContent += inputValue + '\n';
    localStorage.setItem('storedContent', storedContent);
    
    // store the new BI to localStorage
    var data = {
        input: inputValue,
        attribute: [timeselectData,tanselectData]
      };
    var storedData = localStorage.getItem('data');
    console.log(storedData);
    if (storedData!==null){
        storedData = JSON.parse(storedData);
    }
    else{
        storedData = [];
    }
    storedData.push(data);
    localStorage.setItem('data', JSON.stringify(storedData));
    //console.log(newBI);
    console.log(data);
    console.log(storedData);
    alert("New BI added successfully!")
}

function showName(){
    //Display name and cate
    var queryString = window.location.search;
    var searchParams = parseQueryString(queryString);
    //var category = searchParams['param1'];
    var name = searchParams['param'];
    console.log('recieved name: ', name);
    var nameContainer = document.getElementById('threatName');
    //var cateContainer = document.getElementById('threatCate');
    var threatName = this.document.createElement('mark');
    threatName.textContent = name;
    nameContainer.appendChild(threatName);
    //var threatCate = this.document.createElement('p');
    //threatCate.textContent = category;
    //cateContainer.appendChild(threatCate);

}
/*
function showBI(){
    //Display BI according to cia
    var queryString = window.location.search;
    var searchParams = parseQueryString(queryString);
    var category = searchParams['param1'];
    switch (category)
    {
        case 'Confidentiality':
           
            var tangibleCheckboxOptions = [
                { label: 'Violation of commercial agreements with industrial partners on data confidentiality (estimated penalty).', value: 'violation'},
                { label: 'Customer breach notification (direct expenses associated with informing and advising individuals whose data has been compromised, can include printing, mailing, and call center services).', value: 'notification' },
                { label: 'Post-customer breach notification (direct cost of credit monitoring or identify theft protection services).', value: 'postNotification' },
                { label: 'Public relations (direct costs associated with managing external communications or brand monitoring following an incident).', value: 'public' },
            ];
            var intangibleCheckboxOptions = [
                { label: 'Increased cost to raise debt (the victim organization faces higher interest rates for borrowed capital, either when raising debt or when renegotiating existing debt as a result of a drop in credit rating).', value: 'debit' },
                { label: 'Lost value of customer relationships (how much the business must invest to acquire that customer or member).', value: 'lostCustomer' },
                { label: 'Value of future lost contract revenue (lost future opportunity associated with contracts that are terminated as a result of a cyber incident).', value: 'lostContract' },
                { label: 'Theft of Intellectual Property (IP) (Attorney fees and litigation).', value: 'lostIP' },
            ];
            break;
        case 'Integrity':
            var tangibleCheckboxOptions = [
                { label: 'Damages to working machines (recovery fee).', value: 'workmachine' },
                { label: 'Quality degradation of products (waste and cost for re-production).', value: 'quality' },
                { label: 'Violation of standards and regulations in safety and pollution (regulatory compliance /penalty).', value: 'safetyPenalty' },
                { label: 'Violation of commercial agreements with customers on product specifications (estimated penalty).', value: 'specificationPenalty' }
              ];
            var intangibleCheckboxOptions = [
                { label: 'Lost value of customer relationships (how much the business must invest to acquire that customer or member).', value: 'lostCustomer' },
                { label: 'Value of future lost contract revenue (lost future opportunity associated with contracts that are terminated as a result of a cyber incident).', value: 'lostContract' }
              ];
              break;
        case 'Availability':
            var tangibleCheckboxOptions = [
                { label: 'Product loss of revenue during disruptive time (lost sale values).', value: 'lostSale' },
                { label: 'Violation of commercial agreements with customers on delivery time (estimated penalty).', value: 'timePenalty' }
              ];
            var intangibleCheckboxOptions = [
                { label: 'Insurance premium increases (additional costs an insured entity might incur to purchase or renew cyber risk insurance policies following a cyber incident).', value: 'insurance'},
                { label: 'Lost value of customer relationships (how much the business must invest to acquire that customer or member).', value: 'lostCustomer' },
                { label: 'Value of future lost contract revenue (lost future opportunity associated with contracts that are terminated as a result of a cyber incident).', value: 'lostContract' }
              ];
              break;

    }
    // insert checkbox
    var TcheckboxContainer = document.getElementById('tangibleCheckboxContainer');  
    tangibleCheckboxOptions.forEach(function(option, index) {
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = option.value;
      checkbox.value = option.value;
      var checkboxId = 'checkbox_t_' + index;
      checkbox.id = checkboxId;

      var label = document.createElement('label');
      label.textContent = option.label;
      label.setAttribute('for', checkboxId);

      // Get checkbox state from localStorage and set it
      var storedState = localStorage.getItem(checkboxId);
      checkbox.checked = storedState === 'true';

      // Listen for checkbox state change events
      checkbox.addEventListener('change', function() {
        // Save the checked state to localStorage
        localStorage.setItem(checkboxId, checkbox.checked);
        localStorage.setItem('label_' + checkboxId, option.label);
      });

      TcheckboxContainer.appendChild(checkbox);
      TcheckboxContainer.appendChild(label);
      TcheckboxContainer.appendChild(document.createElement('br'));
    });
    var IcheckboxContainer = document.getElementById('intangibleCheckboxContainer');
    intangibleCheckboxOptions.forEach(function(option,index) {
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = option.value;
      checkbox.value = option.value;
      var checkboxId = 'checkbox_i_' + index;
      checkbox.id = checkboxId;

      var label = document.createElement('label');
      label.textContent = option.label;
      label.setAttribute('for', checkboxId);

      // Get checkbox state from localStorage and set it
      var storedState = localStorage.getItem(checkboxId);
      checkbox.checked = storedState === 'true';

      // Listen for checkbox state change events
      checkbox.addEventListener('change', function() {
        // Save the checked state to localStorage
        localStorage.setItem(checkboxId, checkbox.checked);
        localStorage.setItem('label_' + checkboxId, option.label);
      });

      IcheckboxContainer.appendChild(checkbox);
      IcheckboxContainer.appendChild(label);
      IcheckboxContainer.appendChild(document.createElement('br'));
    });
}
*/

function showNewBI(){
    //localStorage.removeItem("storedContent");
    var storedContent = localStorage.getItem('storedContent');
    //localStorage.removeItem("data");
    var storedData = localStorage.getItem('data');
    storedData = JSON.parse(storedData);
    if (storedContent) {
        var contentArray = storedContent.split('\n');
        var contentContainer = document.getElementById('newBIContainer');
        var v = 1;

        contentArray.forEach(function(content) {
            if (content) {
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = v;
                checkbox.value = v;
                var filteredElements = storedData.filter(item => item.input === content);
                //console.log(filteredElements);
                var att = filteredElements[0]['attribute'];
                //console.log(att);
                checkbox.id = content+att[0]+att[1];
                //console.log(checkbox.id);
                v+1;
          
                var label = document.createElement('label');
                label.textContent = content;
          
                contentContainer.appendChild(checkbox);
                contentContainer.appendChild(label);
                contentContainer.appendChild(document.createElement('br'));
            }
        });
    } 
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

function getSelectedLabels() {
    var selectedBI = [];
    var containers = document.querySelectorAll('.cont');
    containers.forEach(container =>{
        var checkboxes =  container.querySelectorAll('input[type="checkbox"]:checked');
        checkboxes.forEach(function(checkbox) {
            var label = checkbox.nextElementSibling.textContent;
            console.log(label);
            var id = checkbox.id;
            dic = {label: label, id: id};    
             
            const exists = selectedBI.some(item =>item.key === dic.key &&item.value === dic.value);
            //if (exists)          
            selectedBI.push(dic);           
            console.log(selectedBI);
        });
    });
    //var checkboxes = Container.querySelectorAll('input[type="checkbox"]:checked');
    
    /*
    var oContainer =  document.getElementById('intangibleCheckboxContainer');
    var ocheckboxes = oContainer.querySelectorAll('input[type="checkbox"]:checked');
    ocheckboxes.forEach(function(checkbox) {
        var label = checkbox.nextElementSibling.textContent;
        var id = checkbox.id;
        selectedBI.push({ label: label, id: id });
    });
    
    var newContainer =  document.getElementById('newBI');
    var newcheckboxes = newContainer.querySelectorAll('input[type="checkbox"]:checked');
    console.log(newcheckboxes);
    var newBI = localStorage.getItem('data');
    newBI = JSON.parse(newBI);
    console.log(newBI);
    newcheckboxes.forEach(function(checkbox){
        var label = checkbox.nextElementSibling.textContent;
        console.log(label);
        for (var i=0; i<newBI.length;i++)
        {
            if(label === newBI[i]['input']){
                var att = newBI[i]['attribute'];
                var id = att[0];
                selectedBI.push({ label: label, id: id });
                break;
            }
        }
    });*/
    console.log(selectedBI);
    return selectedBI;
}

function toInput() {
    //Save chosen BI
    var selectedLabels = getSelectedLabels();
    //alert(JSON.stringify(selectedLabels));
    localStorage.setItem('selectedCheckboxes', JSON.stringify(selectedLabels));
    var queryString = window.location.search;
    var searchParams = parseQueryString(queryString);
    //var category = searchParams['param1'];
    var name = searchParams['param'];
    var url = 'input.html?data=' + encodeURIComponent(name);
    window.location.href = url;
}   

function showSelectedLabels(){
    const containers = document.querySelectorAll('.cont');
    containers.forEach(container => {
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  
        checkboxes.forEach(checkbox => {
          const localStorageKey = checkbox.id;
          const savedValue = localStorage.getItem(localStorageKey);
  
          if (savedValue === 'true') {
            checkbox.checked = true;
          }
  
          checkbox.addEventListener('change', () => {
            localStorage.setItem(localStorageKey, checkbox.checked);
          });
        });
    });
}

window.addEventListener('load', showName);
window.addEventListener('load', showSelectedLabels);

window.addEventListener('load', showNewBI);
window.addEventListener('load', getSelectedLabels);