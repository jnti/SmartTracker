google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawCovidChart);
google.charts.setOnLoadCallback(drawSpyChart);
google.charts.setOnLoadCallback(drawDiaChart);

var intervalId1, intervalId2;

// using my local rest api endpoint to get the data 
function drawCovidChart() {
    var counter = 0;
    var stockJSON = "{ \"cols\": [ {\"id\":\"\",\"label\":\"Month\",\"pattern\":\"\",\"type\":\"date\"}, {\"id\":\"\",\"label\":\"Daily Number of Coronavirus Cases\",\"pattern\":\"\",\"type\":\"number\"} ], \"rows\": [ ";

    fetch('http://localhost:3000/daily-cases')
        .then(response => response.json())
        .then(data => {
            for (var i = 0; i < data.length; i++) {
                counter++;
                var year = new Date(data[i].covid_date).getUTCFullYear();
                var month = new Date(data[i].covid_date).getUTCMonth();
                var day = new Date(data[i].covid_date).getUTCDate();
                var date = year + ", " + month + ", " + day;

                if (counter == data.length) {
                    stockJSON += "{\"c\":[{\"v\":\"Date(" + date + ")\",\"f\":null},{\"v\":\"" + data[i].daily_cases + "\",\"f\":null}]}";
                } else {
                    stockJSON += "{\"c\":[{\"v\":\"Date(" + date + ")\",\"f\":null},{\"v\":\"" + data[i].daily_cases + "\",\"f\":null}]},";
                }
            }
            stockJSON += " ] }";

            // Create our data table out of JSON data loaded from server.
            var data = new google.visualization.DataTable(stockJSON);

            var options = {
                hAxis: {
                    title: 'Months',
                    format: 'MMM, YYYY'
                },
                vAxis: {
                    title: 'Daily Number of Coronavirus Cases'
                },
                colors: ['#FF3333']
            };

            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.ColumnChart(document.getElementById('covid_chart_div'));
            chart.draw(data, options);

            //create trigger to resizeEnd event     
            $(window).resize(function () {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function () {
                    $(this).trigger('resizeEnd');
                }, 100);
            });

            //redraw graph when window resize is completed  
            $(window).on('resizeEnd', function () {
                drawCovidChart(data, options);
            });
        });
}

const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (typeof minutes == "undefined") {
        minutes = '00';
    }

    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}

function drawSpyChart() {
    drawIntradayChart('spy', 'chart_div1');
    try {
        intervalId1 = setInterval(function () { drawIntradayChart('spy', 'chart_div1'); }, 60000);
    } catch (e) {
        console.log(e);
    }
}

function drawDiaChart() {
    drawIntradayChart('dia', 'chart_div2');
    try {
        intervalId2 = setInterval(function () { drawIntradayChart('dia', 'chart_div2'); }, 60000);
    } catch (e) {
        console.log(e);
    }
}

function drawIntradayChart(stock, div) {
    var counter = 0;
    var stockJSON = "{ \"cols\": [ {\"id\":\"\",\"label\":\"Time\",\"pattern\":\"\",\"type\":\"datetime\"}, {\"id\":\"\",\"label\":\"Price\",\"pattern\":\"\",\"type\":\"number\"} ], \"rows\": [ ";

    fetch('https://sandbox.iexapis.com/stable/stock/' + stock + '/intraday-prices?token=Tsk_1b2016fce93e48a1aac9228923da22d1')
        .then(response => response.json())
        .then(data => {
            for (var i = 0; i < data.length; i++) {
                counter++;
                var year = new Date(data[i].date).getUTCFullYear();
                var month = new Date(data[i].date).getUTCMonth();
                var day = new Date(data[i].date).getUTCDate();
                var convertedHours = convertTime12to24(data[i].label);
                var min = convertedHours.replace(":", ", ");
                var date = year + ", " + month + ", " + day + ", " + min;

                if (counter == data.length) {
                    stockJSON += "{\"c\":[{\"v\":\"Date(" + date + ")\",\"f\":null},{\"v\":\"" + data[i].average + "\",\"f\":null}]}";
                } else {
                    stockJSON += "{\"c\":[{\"v\":\"Date(" + date + ")\",\"f\":null},{\"v\":\"" + data[i].average + "\",\"f\":null}]},";
                }
            }
            stockJSON += " ] }";

            var data = new google.visualization.DataTable(stockJSON);

            var options = {
                hAxis: {
                    title: 'Time',
                    format: 'HH:mm'
                },
                vAxis: {
                    title: 'Price',
                    format: 'currency'
                },

                colors: ['#008000']
            };

            // Instantiate and draw our chart, passing in some options.
            var intradayChart = new google.visualization.LineChart(document.getElementById(div))
            intradayChart.draw(data, options);

            //create trigger to resizeEnd event     
            $(window).resize(function () {
                if (this.resizeTO) clearTimeout(this.resizeTO);
                this.resizeTO = setTimeout(function () {
                    $(this).trigger('resizeEnd');
                }, 100);
            });

            //redraw graph when window resize is completed  
            $(window).on('resizeEnd', function () {
                intradayChart.draw(data, options);
            });
        });
}

// function drawCovidChart() {
//     var jsonData = $.ajax({
//         url: "./assets/scripts/getCovidBarChartData.php",
//         dataType: "json",
//         async: false
//     }).responseText;

//     // Create our data table out of JSON data loaded from server.
//     var data = new google.visualization.DataTable(jsonData);

//     var options = {
//         hAxis: {
//             title: 'Months',
//             format: 'MMM, YYYY'
//         },
//         vAxis: {
//             title: 'Daily Number of Coronavirus Cases'
//         },
//         colors: ['#FF3333']
//     };

//     // Instantiate and draw our chart, passing in some options.
//     var chart = new google.visualization.ColumnChart(document.getElementById('covid_chart_div'));
//     chart.draw(data, options);
// }

// function to get the entire stock price over 5 year
// function drawSPYLineChart() {
//     var counter = 0;
//     var stockJSON = "{ \"cols\": [ {\"id\":\"\",\"label\":\"Time\",\"pattern\":\"\",\"type\":\"date\"}, {\"id\":\"\",\"label\":\"Price\",\"pattern\":\"\",\"type\":\"number\"} ], \"rows\": [ ";
//     fetch('https://sandbox.iexapis.com/stable/stock/spy/chart/5y?token=Tsk_1b2016fce93e48a1aac9228923da22d1')
//         .then(response => response.json())
//         .then(data => {
//             for (var i = 0; i < data.length; i++) {
//                 counter++;
//                 var year = new Date(data[i].date).getUTCFullYear();
//                 var month = new Date(data[i].date).getUTCMonth();
//                 var day = new Date(data[i].date).getUTCDate();
//                 var date = year + ", " + month + ", " + day;

//                 if (counter == data.length) {
//                     stockJSON += "{\"c\":[{\"v\":\"Date(" + date + ")\",\"f\":null},{\"v\":\"" + data[i].close + "\",\"f\":null}]}";
//                 } else {
//                     stockJSON += "{\"c\":[{\"v\":\"Date(" + date + ")\",\"f\":null},{\"v\":\"" + data[i].close + "\",\"f\":null}]},";
//                 }
//             }
//             stockJSON += " ] }";

//             var data = new google.visualization.DataTable(stockJSON);

//             var options = {
//                 hAxis: {
//                     title: 'Time',
//                     format: 'MMM, YYYY'
//                 },
//                 vAxis: {
//                     title: 'Price'
//                 },
//                 colors: ['#008000']
//             };

//             // Instantiate and draw our chart, passing in some options.
//             var chart = new google.visualization.LineChart(document.getElementById('spy_chart_div'));
//             chart.draw(data, options);

//             //create trigger to resizeEnd event     
//             $(window).resize(function () {
//                 if (this.resizeTO) clearTimeout(this.resizeTO);
//                 this.resizeTO = setTimeout(function () {
//                     $(this).trigger('resizeEnd');
//                 }, 100);
//             });

//             //redraw graph when window resize is completed  
//             $(window).on('resizeEnd', function () {
//                 drawSPYLineChart(data, options);
//             });
//         });
// }

// function to get the entire stock price over 5 year
// function drawDIALineChart() {
//     var counter = 0;
//     var stockJSON = "{ \"cols\": [ {\"id\":\"\",\"label\":\"Time\",\"pattern\":\"\",\"type\":\"date\"}, {\"id\":\"\",\"label\":\"Price\",\"pattern\":\"\",\"type\":\"number\"} ], \"rows\": [ ";
//     fetch('https://sandbox.iexapis.com/stable/stock/dia/chart/5y?token=Tsk_1b2016fce93e48a1aac9228923da22d1')
//         .then(response => response.json())
//         .then(data => {
//             for (var i = 0; i < data.length; i++) {
//                 counter++;
//                 var year = new Date(data[i].date).getUTCFullYear();
//                 var month = new Date(data[i].date).getUTCMonth();
//                 var day = new Date(data[i].date).getUTCDate();
//                 var date = year + ", " + month + ", " + day;

//                 if (counter == data.length) {
//                     stockJSON += "{\"c\":[{\"v\":\"Date(" + date + ")\",\"f\":null},{\"v\":\"" + data[i].close + "\",\"f\":null}]}";
//                 } else {
//                     stockJSON += "{\"c\":[{\"v\":\"Date(" + date + ")\",\"f\":null},{\"v\":\"" + data[i].close + "\",\"f\":null}]},";
//                 }
//             }
//             stockJSON += " ] }";

//             var data = new google.visualization.DataTable(stockJSON);

//             var options = {
//                 hAxis: {
//                     title: 'Time',
//                     format: 'MMM, YYYY'
//                 },
//                 vAxis: {
//                     title: 'Price'
//                 },
//                 colors: ['#008000']
//             };

//             // Instantiate and draw our chart, passing in some options.
//             var chart = new google.visualization.LineChart(document.getElementById('dia_chart_div'));
//             chart.draw(data, options);

//             //create trigger to resizeEnd event     
//             $(window).resize(function () {
//                 if (this.resizeTO) clearTimeout(this.resizeTO);
//                 this.resizeTO = setTimeout(function () {
//                     $(this).trigger('resizeEnd');
//                 }, 100);
//             });

//             //redraw graph when window resize is completed  
//             $(window).on('resizeEnd', function () {
//                 drawDIALineChart(data, options);
//             });
//         });
// }