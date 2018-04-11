# meteo node

## Function

This node returns Yahoo weather informations about the city stored in msg.city.
You can set the unity and your informations preferences dynamically or in the configuration panel :
- msg.unity : C° or F°,
- msg.weather : Prevision of the day or actual weather

It returns 2 attributes:

- weather informations in msg.payload;
- weather picture in msg.picture;

## Dependencies

We recommend you to use this node with the node city.

This node uses YQL (provided by Yahoo) to retrieve the informations.

This node needs the NPM packages named follow-redirects and url.
