const { config } = require("dotenv");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
config();
const PORT = process.env.PORT || 3000;
const server = express();

server.set("view engine", "ejs");
server.use(express.static("public"));
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  return res.render("home");
});

server.get("/search/", async (req, res) => {
  try {
    const search = req.query?.search;
    let response = await axios.get(
      `https://savvytime.com/api/search/timezone?query=${search}`
    );
    // return res.json({
    //   message: 'Success',
    //   data: response.data
    // })
    return res.send(response.data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Fail",
    });
  }
});

server.get("/time", async (req, res) => {
  try {
    const response = await axios.get(
      `https://timeapi.io/api/Time/current/coordinate/?latitude=${req.query?.lat}&longitude=${req.query?.lon}`
    );
    return res.status(200).json({
      status: "Success",
      data: response.data,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Fail",
    });
  }
  // return res.render('home')
});

server.post("/time/convert", async (req, res) => {
  try {
    console.log(req.body);
    const date = req.body.date;
    console.log(date.split("T"));
    const dateOnly = date.split("T");
    const dateTime = dateOnly[0] + " " + req.body.time + ":00";
    // console.log(dateTime)
    const toTimezone = req.body?.toTimezone;
    const changeTime = [];
    // for (let timeZone of toTimezone) {
    //   const response = await axios.post(
    //     "https://timeapi.io/api/Conversion/ConvertTimeZone",
    //     {
    //       fromTimeZone: req.body?.fromTimezone,
    //       dateTime: dateTime,
    //       toTimeZone: timeZone.timezone,
    //       dstAmbiguity: "",
    //     }
    //   );
    //   const timeObj = {
    //     // name: timeZone.name,
    //     timezone: timeZone?.timezone,
    //     time: response?.data?.conversionResult?.time,
    //     date: response?.data?.conversionResult?.date,
    //     result: response?.data?.conversionResult,
    //   };
    //   console.log(timeObj)
    //   changeTime.push(timeObj)
    // }
    const response = await axios.post(
      "https://timeapi.io/api/Conversion/ConvertTimeZone",
      {
        fromTimeZone: req.body?.fromTimezone,
        dateTime: dateTime,
        toTimeZone: req.body?.toTimezone,
        dstAmbiguity: "",
      }
    );
    const obj = {
      date: response?.data?.conversionResult.date,
      time: response?.data?.conversionResult.time,
    };
    return res.status(200).json({
      status: "Success",
      data: obj,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      status: "Fail",
    });
  }
});

server.listen(PORT);
