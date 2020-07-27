const dotenv = require('dotenv');
dotenv.config();

const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

const getDates = (request, response) => {
    pool.query("SELECT covid_date FROM daily_cases", (error, results) => {
        if (error) {
            throw error
        }
        
        response.status(200).json(results.rows)
    })
}

const getCases = (request, response) => {
    pool.query("SELECT daily_cases FROM daily_cases", (error, results) => {
        if (error) {
            throw error
        }
        
        response.status(200).json(results.rows)
    })
}

const getDailyCases = (request, response) => {
    pool.query("SELECT * FROM daily_cases", (error, results) => {
        if (error) {
            throw error
        }
        
        response.status(200).json(results.rows)
    })
}

const getCompleteData = (request, response) => {
    pool.query("SELECT * FROM complete_data", (error, results) => {
        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const getCompleteDataByDate = (request, response) => {
    const data_date = request.params.data_date

    pool.query("SELECT * FROM complete_data WHERE data_date = $1", [data_date], (error, results) => {
        if (error) {
            throw error
        }

        response.status(200).json(results.rows)
    })
}

const addCompleteData = (request, response) => {
    const { data_date, total_cases, new_cases, total_deaths, new_deaths } = request.body
   
    pool.query("INSERT INTO complete_data (data_date, total_cases, new_cases, total_deaths, new_deaths) VALUES ($1, $2, $3, $4, $5) RETURNING *", [data_date, total_cases, new_cases, total_deaths, new_deaths], (error, results) => {
      if (error) {
        throw error
      }

      response.status(201).send(`Added Complete Data: ${data_date}`)
    })
}

const addDailyCases = (request, response) => {
    const { covid_date, daily_cases } = request.body
   
    pool.query("INSERT INTO daily_cases (covid_date, daily_cases) VALUES ($1, $2) RETURNING *", [covid_date, daily_cases], (error, results) => {
      if (error) {
        throw error
      }

      response.status(201).send(`Added Daily Cases: ${covid_date}`)
    })
}

const deleteCompleteDataByDate = (request, response) => {
    const data_date = request.params.data_date
   
    pool.query("DELETE FROM complete_data WHERE data_date = $1", [data_date], (error, results) => {
      if (error) {
        throw error
      }

      response.status(200).send(`Deleted Complete Data: ${data_date}`)
    })
}

module.exports = {
    getDates,
    getCases,
    getDailyCases,
    getCompleteData,
    getCompleteDataByDate,
    addCompleteData,
    addDailyCases,
    deleteCompleteDataByDate
}