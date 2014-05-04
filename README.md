# EditableHandlers #

This is a project which will include different tools to edit/play with geometries in Leaflet.
Currenlty I added support for:

+ Circle editor (L.CircleEditor)
+ Measuring tool (L.MeasuringTool)
+ Label for the polygon sides (L.PolySideLabel)

## Circle edition (L.CircleEditor) ##
That is, the user can move the circle as well as increase the radius of the circle by just using the drag areas.

CircleEditor extends from L.Circle and adds the handlers in order to move and increase the area.
To use it, it is the same way as initializing a Circle, with the difference that you will just call CircleEditor instead.

Code example:

```
    var radius = 500; /*radius in meters*/
    var eCircle = new L.CircleEditor(locationLatLng, radius, circleOptions);
    map.addLayer(eCircle);
```

The circle editor has one additional feature. The dragger icon can be set (with css) to grow when the mouse is over it, this makes the dragging action of the center or its radius easier for the user. Just set the option called __'extendedIconClass'__ to any of the styles currenlty set in the css file:

+ .extend-icon
+ .extend-icon-medium
+ .extend-icon-xl


## Measuring tool (L.MeasuringTool) ##
With this class you get the option measure the distance of a path.
The new change makes it possible to measure the distance between multiple points.
There is an option to show distance between points, __'displayPartialDistance'__ which is set to false by default, and to show the total distance, __'displayTotalDistance'__ which is true by default.
The class allows you style the line as well as the tooltip which shows the distance info.
Also it allows you to set the icons for the start and stop points in the map.
You will be able to grab the icons and move them at will. The distance is updated.

Code example:

```
    measuringTool = new L.MeasuringTool(map);
    measuringTool.enable();
	
    //use the method disable to terminate the measuring.
    measuringTool.disable();
```


## Label for the polygon sides (L.PolySideLabel) ##
This class will show the distance between each of the vertices of the polygon/polyline when the mouse is on top of it.
It works great for most browsers, except for IE7/8 where on hover, it shows the info for all the polygones at the same time (and not only the one you are hovering over).

### Notes ###
* There is a limit of sides (option __bodersLimit__ = 8) which you can change. This limit sets the max amount of sides for a polygon to show the length info. If is greater, then nothing is shown.
* If the sides are too small (option __minSideLength__ 40 meters), then instead of the distance, you will get characters and a leyend on the side indicating the sides for each character.
* There is a limit for the visible area (option __minAreaToShow__). If the visible drawn area is smaller than this, the info wil not be shown.

Code example:

```
    var polygon = new L.Polygon(...);
    ....
    map.addLayer(polygon);
    var labelPolygon = new L.PolySideLabel(polygon, options);
```

