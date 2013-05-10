# EditableHandlers #

This is a project which will include different tools to edit/play with geometries in Leaflet.
Currenlty I added support for:
* Circle editor (L.CircleEditor)
* Measuring tool (L.MeasuringTool)
* Label for the polygon sides (L.PolySideLabel)

## Circle edition (L.CircleEditor) ##
That is, the user can move the circle as well as increase the radius of the circle by just using the drag areas.

CircleEditor extends from L.Circle and adds the handlers in order to move and increase the area.
To use it is the same way as initializing a Circle, with the difference that you will just call CircleEditor.

Code example:

    var eCircle = new L.CircleEditor(locationLatLng, 500 /*radius in meters*/, circleOptions);
    map.addLayer(eCircle);

## Measuring tool (L.MeasuringTool) ##
In this class, you get the option to set two points and get a distance between them.
The class allows you to set the class name for the line and the tooltip that will be shown with the information.
Also it allows you to set the icons for the start and stop points in the map.
You will be able to grab the icons and move them at will. The distance is updated.

Code example:

    measuringTool = new L.MeasuringTool(map);
    measuringTool.enable();
	
    //use the method disable to terminate the measuring.
    measuringTool.disable();


Future work: There are still some improvements which I will do later, 
such as allowing to add as many points as possible and get the total distance.

## Label for the polygon sides (L.PolySideLabel) ##
This class will show the distance between each of the vertices of the polygon/polyline when the mouse
is on top of it.
It works great for most browsers, except for IE7/8 where on hover, it shows the info for all the polygones at 
the same time (and not only the one you are hovering over).

### Notes ###
* There is a limit of sides (option bodersLimit = 8) which you can change. This limit sets the max amount of sides for a polygon to show the length info. If is greater, then nothing is shown.
* If the sides are too small (option minSideLength 40 meters), then instead of the distance, you will get characters and a leyend on the side indicating the sides for each character.
* There is a limit for the visible area (option minAreaToShow). If the visible drawn area is smaller than this, the info wil not be shown.

The code is also a bit messy and needs to be worked on, but it is still functional.

Code example:

    var polygon = new L.Polygon(...
    ....
    map.addLayer(polygon);
    var labelPolygon = new L.PolySideLabel(polygon, options);

This class is still a work in progess. It requires rework and cleaning up of the code, but it is still usable.

