module.exports = function(RED) {
  "use strict";
  const Weather = require('ttb-weather')
  const defaultAPIKey = "45bbf485e06dfa30c7d7138030f25ed6"

  function main(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.apiKey = config.apiKey;
    node.city = config.city;
    node.country = config.country;
    node.unity = config.unity;
    node.weather = config.weather;

    node._weather = new Weather()

    this.on("input", function(msg) {
      var apiKey = node.apiKey || defaultAPIKey;
      if (typeof(msg.apiKey) != "undefined" && msg.apiKey != "") { apiKey = msg.apiKey; }
      var city = node.city || "Paris";
      if (typeof(msg.city) != "undefined" && msg.city != "") { city = msg.city; }
      var country = node.country || "France";
      if (typeof(msg.country) != "undefined" && msg.country != "") { country = msg.country; }
      var unity = node.unity || Weather.UNIT.TEMPERATURE.CELSIUS;
      if (typeof(msg.unity) != "undefined" && msg.unity != "") { unity = msg.unity; }
      var weather = node.weather || Weather.MODE.WEATHER;
      if (typeof(msg.weather) != "undefined" && msg.weather != "") { weather = msg.weather; }

      var lang = RED.settings.get("functionGlobalContext").settings.lang || 'auto'
      lang = lang.toUpperCase().split('-')[0]
      if(Weather.LANG.hasOwnProperty(lang)){
        lang = Weather.LANG[lang]
      } else {
        lang = Weather.LANG.FR
      }

      if(['c', 'celsius'].indexOf(unity.toLowerCase()) !== -1 ){
        unity = Weather.UNIT.TEMPERATURE.CELSIUS
      } else if(['f', 'fahrenheit'].indexOf(unity.toLowerCase()) !== -1 ){
        unity = Weather.UNIT.TEMPERATURE.FAHRENHEIT
      }

      if(weather === 'actual'){
        weather = Weather.MODE.WEATHER
      } else if(weather === 'prevision'){
        weather = Weather.MODE.FORECAST
      }

      this.status({fill: "blue", shape: "dot", text: RED._('meteo.status.fetching')});
      node._weather
      .setAPI({ key: apiKey})
      .setPosition({city: city, country: country})
      .setTemperatureUnit(unity)
      .setSpeedUnit(Weather.UNIT.SPEED.KMETER_HOUR)
      .setMode(weather)
      .setLang(lang)
      .get()
      .then( data => {
        msg.weather = data
        msg.payload = data.text.simple
        msg.picture = data.icon.path
        node.send(msg);
        node.status({})
      })
      .catch( err => {
        msg.weather = err
        node.send(msg)
        node.status({});
      })
    });
  }
  RED.nodes.registerType("meteo", main);

}
