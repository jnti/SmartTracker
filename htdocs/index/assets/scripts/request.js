var clickedButton1 = false
var clickedButton2 = false
var div1IntervalId, div2IntervalId;


function thousands_separators(num) {
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

// using my local rest api endpoint to get data
function getDailyInfo() {
  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;
  var day = new Date().getDate() - 1;
  var date = year + "-" + month + "-" + day;

  fetch('http://localhost:3000/complete-data/' + date)
    .then(response => response.json())
    .then(data => {
      if (data.length == 0) {
        year = new Date().getFullYear();
        month = new Date().getMonth() + 1;
        day = new Date().getDate() - 2;
        date = year + "-" + month + "-" + day;

        fetch('http://localhost:3000/complete-data/' + date)
          .then(response => response.json())
          .then(data => {
            var tmp = data[i].data_date.toString();
            var dateString = tmp.slice(0, -14);
            document.getElementById('data_date').innerHTML = dateString;
            document.getElementById('data_date_death').innerHTML = dateString;
            document.getElementById('total_cases').innerHTML = thousands_separators(data[i].total_cases);
            document.getElementById('new_cases').innerHTML = thousands_separators(data[i].new_cases);
            document.getElementById('total_deaths').innerHTML = thousands_separators(data[i].total_deaths);
            document.getElementById('new_deaths').innerHTML = thousands_separators(data[i].new_deaths);
          });
      }
      for (var i = 0; i < data.length; i++) {
        var tmp = data[i].data_date.toString();
        var dateString = tmp.slice(0, -14);
        document.getElementById('data_date').innerHTML = dateString;
        document.getElementById('data_date_death').innerHTML = dateString;
        document.getElementById('total_cases').innerHTML = thousands_separators(data[i].total_cases);
        document.getElementById('new_cases').innerHTML = thousands_separators(data[i].new_cases);
        document.getElementById('total_deaths').innerHTML = thousands_separators(data[i].total_deaths);
        document.getElementById('new_deaths').innerHTML = thousands_separators(data[i].new_deaths);
      }
    });
}

function getCompanyData(input, itag) {
  var userInput = document.getElementById(input).value;

  if (userInput == "") {
    return;
  }

  fetch('https://sandbox.iexapis.com/stable/stock/' + userInput + '/quote?token=Tsk_1b2016fce93e48a1aac9228923da22d1')
    .then(response => response.json())
    .then(data => {
      document.getElementById(itag).innerHTML = "";
      document.getElementById(itag).innerHTML = data.companyName;
      document.getElementById(input).value = "";

      if (clickedButton1 == true) {
        clickedButton1 = false;
        clearInterval(intervalId1);
        clearInterval(div1IntervalId);
        drawIntradayChart(userInput, 'chart_div1');
        try {
          div1IntervalId = setInterval(function () { drawIntradayChart(userInput, 'chart_div1'); }, 60000);
        } catch (e) {
          console.log(e);
        }
      }

      if (clickedButton2 == true) {
        clickedButton2 = false;
        clearInterval(intervalId2);
        clearInterval(div2IntervalId);
        drawIntradayChart(userInput, 'chart_div2');
        try {
          div2IntervalId = setInterval(function () { drawIntradayChart(userInput, 'chart_div2'); }, 60000);
        } catch (e) {
          console.log(e);
        }
      }
    });
}


function getSectorPerformance() {
  fetch('https://sandbox.iexapis.com/stable/stock/market/sector-performance?token=Tsk_1b2016fce93e48a1aac9228923da22d1')
    .then(response => response.json())
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        var num = i + 1;
        var nameId = 'sec_name' + num.toString();
        var perfId = 'sec_perf' + num.toString();
        document.getElementById(nameId).innerHTML = data[i].name;
        document.getElementById(perfId).innerHTML = data[i].performance;
      }
    });
}

function getTimeline(input, div) {
  var userInput = document.getElementById(input).value;
  var twtDiv = document.getElementById(div);

  if (userInput == "") {
    return;
  }

  twtDiv.innerHTML = "";

  var atag = document.createElement('a');
  atag.className = "twitter-timeline";
  atag.href = "https://twitter.com/" + userInput;
  atag.innerHTML = "Tweets by @" + userInput;
  atag.setAttribute("data-tweet-limit", 5);
  document.getElementById(input).value = "";
  twtDiv.appendChild(atag);

  twttr.widgets.load(document.getElementById(twtDiv));  
}

document.getElementById('button1').addEventListener("click", function () {
  clickedButton1 = true;
});

document.getElementById('button2').addEventListener("click", function () {
  clickedButton2 = true;
});

getSectorPerformance();
getDailyInfo();

// function getDailyInfo() {
//   var jsonData = $.ajax({
//     url: "./assets/scripts/getDailyData.php",
//     dataType: "json",
//     async: false
//   }).responseText;

//   var jsonObj = JSON.parse(jsonData);
//   document.getElementById('data_date').innerHTML = jsonObj.data_date;
//   document.getElementById('data_date_death').innerHTML = jsonObj.data_date;
//   document.getElementById('total_cases').innerHTML = thousands_separators(jsonObj.total_cases);
//   document.getElementById('new_cases').innerHTML = thousands_separators(jsonObj.new_cases);
//   document.getElementById('total_deaths').innerHTML = thousands_separators(jsonObj.total_deaths);
//   document.getElementById('new_deaths').innerHTML = thousands_separators(jsonObj.new_deaths);
// }