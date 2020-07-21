const fetch = require('isomorphic-fetch')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { Client } = require('pg');
const connectionString = 'postgres://postgres:password@localhost:5432/postgres';
const client = new Client({
    connectionString: connectionString
});
var totalCasesInt, newCasesInt, totalDeathsInt, newDeathsInt;

async function getCovidData() {
    const response = await fetch('https://www.cdc.gov/coronavirus/2019-ncov/cases-updates/cases-in-us.html', {
        headers: {
            'Cache-Control': 'no-cache'
        }
    });
    const text = await response.text();
    const dom = await new JSDOM(text);

    var totalCases = dom.window.document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(1) > div > div > div > section > div > div > div:nth-child(1) > span.count").textContent;
    var newCases = dom.window.document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(1) > div > div > div > section > div > div > div:nth-child(1) > span.new-cases").textContent;
    var totalDeaths = dom.window.document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(1) > div > div > div > section > div > div > div:nth-child(2) > span.count").textContent;
    var newDeaths = dom.window.document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(1) > div > div > div > section > div > div > div:nth-child(2) > span.new-cases").textContent;

    totalCasesInt = totalCases.replace(/,/g, "");
    var tmpCases = newCases.replace(/ New Cases\*/, "")
    newCasesInt = tmpCases.replace(/,/g, "");
    totalDeathsInt = totalDeaths.replace(/,/g, "");
    var tmpDeaths = newDeaths.replace(/ New Deaths\*/, "");
    newDeathsInt = tmpDeaths.replace(/,/g, "");
};

(async () => {
    await getCovidData();

    var dataDate = new Date();
    var dd = String(dataDate.getDate() - 1).padStart(2, '0');
    var mm = String(dataDate.getMonth() + 1).padStart(2, '0');
    var yyyy = dataDate.getFullYear();
    dataDate = yyyy + '-' + mm + '-' + dd;

    client.connect();

    const checkQuery = 'SELECT COUNT(*) FROM complete_data WHERE new_cases = $1';

    client.query(checkQuery, [Number(newCasesInt)], (err, res) => {
        if (err) {
            console.error(err);
            return;
        } else if (res.rows[0].count >= 1) {
            console.log('Data Already Exists');
            client.end();
        } else {
            const query1 = 'INSERT INTO complete_data (data_date, total_cases, new_cases, total_deaths, new_deaths) VALUES ($1, $2, $3, $4, $5)';

            client.query(query1, [dataDate, Number(totalCasesInt), Number(newCasesInt), Number(totalDeathsInt), Number(newDeathsInt)], (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Data Insertion Complete');
            });

            const query2 = 'INSERT INTO daily_cases (covid_date, daily_cases) VALUES ($1, $2)';

            client.query(query2, [dataDate, Number(newCasesInt)], (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Data Insertion Complete');
                client.end();
            });
        }
    });

})()
