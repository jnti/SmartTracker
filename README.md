# SmartTracker

## Setup
1. Download [XAMPP](https://www.apachefriends.org/download.html)
2. Download [Postgres](https://www.postgresql.org/)
3. Clone this repo to your local machine
4. Import daily_cases.csv to a Postgres table
5. To run the Web Scraper
   * `cd "web scraper"`
   * `node insertData.js`
6. Run Express.js REST API 
   * `cd express-api`
   * `node index.js`
7. Run XAMPP Control Panel 
   * Start Apache Server
8. Open a Web Browser and go to http://127.0.0.1/

## Website is now live and can be reached at https://smartracker.live

![Screenshot](https://github.com/jnti/SmartTracker/blob/master/docs/images/Dashboard1.PNG)
![Screenshot](https://github.com/jnti/SmartTracker/blob/master/docs/images/Dashboard2.PNG)
