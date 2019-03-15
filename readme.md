[![License](https://img.shields.io/badge/license-WTFPL-blue.svg)](http://www.wtfpl.net/)
![GitHub issues](https://img.shields.io/github/issues-raw/thethingbox/ttb-node-meteo.svg)
![GitHub package.json version](https://img.shields.io/github/package-json/v/thethingbox/ttb-node-meteo.svg)

# ttb-node-meteo

ttb-node-meteo is a Node-RED node that collects weather information.

## Usages

<p>Retreive the weather data from openweathermap.org</p>

<h3>Inputs</h3>
<dl class="message-properties">
  <dt class="optional">apiKey
    <span class="property-type">string</span>
  </dt>
  <dd>The API key for openweathermap.</dd>

  <dt class="optional">city
    <span class="property-type">string</span>
  </dt>
  <dd>The city name for the weather.</dd>

  <dt class="optional">country
   <span class="property-type">string</span>
  </dt>
  <dd>The country name for the city.</dd>

  <dt class="optional">unity
   <span class="property-type">string</span>
  </dt>
  <dd>
    The unit of temperature used. the possible values are:
    <ul>
      <li>celsius</li>
      <li>c</li>
      <li>fahrenheit</li>
      <li>f</li>
    </ul>
  </dd>

  <dt class="optional">weather
   <span class="property-type">string</span>
  </dt>
  <dd>
    The weather mode (current or forecast). the possible values are:
    <ul>
      <li>actual</li>
      <li>prevision</li>
    </ul>
  </dd>
</dl>

<h3>Outputs</h3>
<dl class="message-properties">
  <dt>payload
   <span class="property-type">string</span>
  </dt>
  <dd>The result of the weather research.</dd>

  <dt>weather
   <span class="property-type">Object</span>
  </dt>
  <dd>The meteorological data.</dd>

  <dt>picture
   <span class="property-type">string</span>
  </dt>
  <dd>the path of the representative image of the weather</dd>
</dl>

<h3>Détails</h3>
<p>
  This node retrieves the current weather or forecast for tomorrow on openweathermap.org for a given city using the <code>ttb-weather</code> node module.
</p>

<p>
  To work, this node needs a valid openweathermap API key, a default one is used if it is not filled in, but it may not work because it is shared and limited to 60 uses per minute.
  To have your own API key, register on <a href="https://openweathermap.org/" target="_blank">openweathermap</a> and go to the <a href="https://home.openweathermap.org/api_keys" target="_blank">API keys</a> section.
  The free offer allows 60 uses per minute and no banking information is requested.
</p>

<h3>Références</h3>
<ul>
    <li><a href="https://github.com/TheThingBox/ttb-node-meteo" target="_blank">GitHub</a> - the nodes github repository</li>
    <li><a href="https://github.com/TheThingBox/ttb-weather" target="_blank">GitHub</a> - the <code>ttb-weather</code> github repository</li>
    <li><a href="https://openweathermap.org/" target="_blank">openweathermap</a> - the openweathermap website</li>
</ul>
