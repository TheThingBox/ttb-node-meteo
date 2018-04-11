module.exports = function(RED) {
  "use strict";
  var http = require("follow-redirects").http;

  function main(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.city = config.city;
    node.country = config.country;
    node.unity = config.unity;
    node.weather = config.weather;

    function getData(opts, callback) {
      var data = {};
      var req = http.request(opts, function(res) {
        res.setEncoding("utf8");
        var r = "";
        res.on("data", function(chunck) {
          r += chunck;
        });
        res.on("end", function() {
          try {
            data = JSON.parse(r);
            if (data.query.results != null) {
              data = data.query.results.channel;
              data = process(data);
              callback(null, data);
            } else {
              getData(opts, callback);
            }
          } catch (e) {
            getData(opts, callback);
          }
        });
      });
      req.end();
      req.on('error', function(err) {
        callback(err, null);
      });
    }

    this.on("input", function(msg) {
      var city = node.city || "Paris";
      if (typeof(msg.city) != "undefined" && msg.city != "") { city = msg.city; }
      var country = node.country || "France";
      if (typeof(msg.country) != "undefined" && msg.country != "") { country = msg.country; }
      var unity = node.unity || "c";
      if (typeof(msg.unity) != "undefined" && msg.unity != "") { unity = msg.unity; }
      var weather = node.weather;
      if (typeof(msg.weather) != "undefined" && msg.weather != "") { weather = msg.weather; }

      var opts = {
        hostname: 'query.yahooapis.com',
        port: 80,
        path: ("/v1/public/yql?q=" + encodeURIComponent("select * from weather.forecast where woeid in (select woeid from geo.places(1)" + " where text=\"" + country + " " + " " + city + "\") and u=\"" + unity + "\"") + "&format=json"),
        method: 'GET',
        json: true
      }

      getData(opts, function(err,data) {
        if(err){return}
        if (weather == "actual") {
          msg.payload = data.city + ":" + data.temp;
          msg.picture = data.picture;
          msg.weather = data.previsionText;
        } else {
          msg.payload = data.city + ":" + data.previsionLow + "-" + data.previsionHigh + data.unity;
          msg.picture = data.previsionPicture;
        }
        node.send(msg);
      });
    });
  }
  RED.nodes.registerType("meteo", main);

  function process(d) {
    if (d.units.temperature == "C") {
      var unity = "°C";
    } else {
      var unity = "°F";
    }
    var lang = getLang();
    return {
      unity: d.units.temperature,
      city: d.location.city,
      wind: d.wind.speed + " km/h",
      humidity: d.atmosphere.humidity + "%",
      pressure: d.atmosphere.pressure + " mBar",
      visibility: d.atmosphere.visibility + " km",
      sunrise: formatDate(d.astronomy.sunrise, lang),
      sunset: formatDate(d.astronomy.sunset, lang),
      temp: d.item.condition.temp + unity,
      text: codeCondition2text(parseInt(d.item.condition.code, 10), lang),
      code: d.item.forecast[0].code,
      previsionText: codeCondition2text(parseInt(d.item.forecast[0].code), lang),
      previsionLow: d.item.forecast[0].low,
      previsionHigh: d.item.forecast[0].high,
      previsionPicture: code2png(parseInt(d.item.forecast[0].code, 10)),
      picture: code2png(parseInt(d.item.condition.code, 10))
    };
  }

  function formatDate(date, lang) {
    switch (lang) {
      case "fr-FR":
        return dateEN2dateFR(date);
      case "en-US":
        return dateEN2dateEN(date);
      default:
        return dateEN2dateEN(date);
    }
  }

  function dateEN2dateEN(d) {
    return d;
  }

  function dateEN2dateFR(d) {
    var a = d.split(" ");
    var b = a[0].split(":");
    var h = a[1] == "am" ? b[0] : parseInt(b[0], 10) + 12;
    return h + "h" + b[1];
  }

  function codeCondition2text(code, lang) {
    switch (lang) {
      case "fr-FR":
        return codeCondition2textFR(code);
      case "en-US":
        return codeCondition2textEN(code);
      default:
        return codeCondition2textEN(code);
    }
  }

  function codeCondition2textEN(code) {
    // look at https://developer.yahoo.com/weather/documentation.html#codes
    switch (code) {
      case 0:
        return "Tornado";
      case 1:
        return "Tropical storm";
      case 2:
        return "Hurricane";
      case 3:
        return "Severe thunderstorms";
      case 4:
        return "Thunderstorms";
      case 5:
        return "Mixed rain and snow";
      case 6:
        return "Mixed rain and sleet";
      case 7:
        return "Mixed snow and sleet";
      case 8:
        return "Freezing drizzle";
      case 9:
        return "Drizzle";
      case 10:
        return "Freezing rain";
      case 11:
      case 12:
        return "Showers";
      case 13:
        return "Snow flurries";
      case 14:
        return "Light snow showers";
      case 15:
        return "Blowing snow";
      case 16:
        return "Snow";
      case 17:
        return "Hail";
      case 18:
        return "Sleet";
      case 19:
        return "Dust";
      case 20:
        return "Foggy";
      case 21:
        return "Haze";
      case 22:
        return "Smoky";
      case 23:
        return "Blustery";
      case 24:
        return "Windy";
      case 25:
        return "Cold";
      case 26:
        return "Cloudy";
      case 27:
      case 28:
        return "Mostly cloudy"
      case 29:
      case 30:
        return "Partly cloudy";
      case 31:
        return "Clear";
      case 32:
        return "Sunny";
      case 33:
      case 34:
        return "Fair";
      case 35:
        return "Mixed rain and hail";
      case 36:
        return "Hot";
      case 37:
        return "Isolated thunderstorms";
      case 38:
      case 39:
        return "Scattered thunderstorms";
      case 40:
        return "Scattered showers";
      case 41:
        return "Heavy snow";
      case 42:
        return "Scattered snow showers";
      case 43:
        return "Heavy snow";
      case 44:
        return "Partly cloudy";
      case 45:
        return "Thundershowers";
      case 46:
        return "Snow showers";
      case 47:
        return "Isolated thundershowers";
    }
  }

  function codeCondition2textFR(code) {
    // look at https://developer.yahoo.com/weather/documentation.html#codes
    switch (code) {
      case 0:
        return "Tornade";
      case 1:
        return "Tempête tropicale";
      case 2:
        return "Ouragan";
      case 3:
        return "Orage violent";
      case 4:
        return "Orage";
      case 5:
        return "Pluie et neige";
      case 6:
        return "Pluie et neige fondue";
      case 7:
        return "Neige et neige fondue";
      case 8:
        return "Bruine verglaçante";
      case 9:
        return "Bruine";
      case 10:
        return "Pluie verglaçante";
      case 11:
      case 12:
        return "Averses";
      case 13:
        return "Averses de neige";
      case 14:
        return "Averses de neige légère";
      case 15:
        return "Poudrerie"; // blowing snow
      case 16:
        return "Neige";
      case 17:
        return "Grêle";
      case 18:
        return "Neige fondue";
      case 19:
        return "Poussière"; // dust
      case 20:
        return "Brumeux";
      case 21:
        return "Brume";
      case 22:
        return "Enfumé"; // smoky
      case 23:
        return "Vent fort"; // blustery
      case 24:
        return "Venteux";
      case 25:
        return "Froid";
      case 26:
        return "Nuageux";
      case 27:
      case 28:
      case 29:
      case 30:
        return "Partiellement nuageux";
      case 31:
        return "Clair";
      case 32:
        return "Ensoleillé";
      case 33:
      case 34:
        return "Beau";
      case 35:
        return "Pluie et grêle";
      case 36:
        return "Chaud";
      case 37:
        return "Orages isolés";
      case 38:
      case 39:
        return "Orages dispersés";
      case 40:
        return "Pluies dispersées";
      case 41:
        return "Forte neige";
      case 42:
        return "Averses de neige dispersées";
      case 43:
        return "Forte neige";
      case 44:
        return "Partiellement nuageux";
      case 45:
        return "Orages";
      case 46:
        return "Averses de neige";
      case 47:
        return "Orages isolatés";
    }
  }

  function code2png(code) {
    switch (code) {
      case 0:
      case 1:
        return __dirname + "/icons/ui-weather-1.png"
      case 2:
        return __dirname + "/icons/ui-weather-2.png";
      case 3:
        return __dirname + "/icons/ui-weather-3.png"
      case 4:
        return __dirname + "/icons/ui-weather-4.png"
      case 5:
        return __dirname + "/icons/ui-weather-5.png"
      case 6:
        return __dirname + "/icons/ui-weather-6.png"
      case 7:
        return __dirname + "/icons/ui-weather-7.png"
      case 18:
      case 8:
        return __dirname + "/icons/ui-weather-8.png"
      case 9:
        return __dirname + "/icons/ui-weather-9.png"
      case 10:
        return __dirname + "/icons/ui-weather-10.png"
      case 11:
      case 12:
        return __dirname + "/icons/ui-weather-12.png"
      case 13:
        return __dirname + "/icons/ui-weather-13.png"
      case 14:
        return __dirname + "/icons/ui-weather-14.png"
      case 16:
      case 42:
      case 46:
      case 15:
        return __dirname + "/icons/ui-weather-15.png"
      case 35:
      case 17:
        return __dirname + "/icons/ui-weather-17.png"
      case 19:
        return __dirname + "/icons/ui-weather-19.png"
      case 20:
      case 21:
        return __dirname + "/icons/ui-weather-21.png"
      case 22:
        return __dirname + "/icons/ui-weather-22.png"
      case 23:
      case 24:
        return __dirname + "/icons/ui-weather-24.png"
      case 32:
      case 36:
      case 25:
        return __dirname + "/icons/ui-weather-25.png"
      case 26:
        return __dirname + "/icons/ui-weather-26.png"
      case 27:
      case 28:
        return __dirname + "/icons/ui-weather-28.png"
      case 29:
        return __dirname + "/icons/ui-weather-29.png"
      case 30:
        return __dirname + "/icons/ui-weather-30.png"
      case 31:
        return __dirname + "/icons/ui-weather-31.png"
      case 33:
        return __dirname + "/icons/ui-weather-33.png"
      case 34:
        return __dirname + "/icons/ui-weather-34.png"
      case 47:
      case 37:
        return __dirname + "/icons/ui-weather-37.png"
      case 38:
        return __dirname + "/icons/ui-weather-38.png"
      case 39:
        return __dirname + "/icons/ui-weather-39.png"
      case 40:
        return __dirname + "/icons/ui-weather-40.png"
      case 41:
      case 43:
        return __dirname + "/icons/ui-weather-43.png"
      case 44:
        return __dirname + "/icons/ui-weather-44.png"
      case 45:
        return __dirname + "/icons/ui-weather-45.png"
    }
  }

  function getLang() {
    return RED.settings.get("functionGlobalContext").settings.lang || "auto";
  }
}
