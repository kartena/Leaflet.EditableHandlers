/*
* This simple measuring tool is created to measure two points.
* It allows to change the icons for the markers as well as 
* sets a class for the label for the pop up information (which you can style it yourself)
* as well as it sets the line with a class so you can manipulate it as well.
*
* TODOS for this tool:
*   1) The tool should allow to measure the distance for N amount of points.
*/
L.MeasuringTool = L.Class.extend({
	initialize: function (map, options, iconStart, iconEnd) {
		L.Util.setOptions(this, options);
		this._map = map;

		this._diStart = iconStart;
		this._diEnd = iconEnd;
		this._measureStart = null;
		this._measureStop = null;
		this._measureLine = null;
		this._distancePopup = null;
		this._markerList = [];
	},

	options: {
        minWidth: 50,
        autoPan: false,
        closeButton: false,
        className: 'measuring-label', /*css label class name*/
		lineClassName: 'measuring-line-class' /*css class name for the line*/
	},

	enable: function() {
		this._map.on('click', this._onMapClick, this);
	},

	disable: function () {
		this._map.off('click', this._onMapClick, this);

		if (this._distancePopup) {
			this._map.removeLayer(this._distancePopup);
			this._distancePopup = undefined;
		}
		if (this._measureLine) {
			this._map.removeLayer(this._measureLine);
			this._measureLine = undefined;
		}
		if (this._measureStop) {
			this._map.removeLayer(this._measureStop);
			this._measureStop = undefined;
		}
		if (this._measureStart) {
			this._map.removeLayer(this._measureStart);
			this._measureStart = undefined;
		}

		for (var i = 0; this._markerList.length; i++) {
			var marker = this._markerList.pop();
			this._map.removeLayer(marker);
		}
	},

	_onMapClick: function (e) {
		var markerLocation = e.latlng;
		var marker = new L.Marker(markerLocation, {draggable:true});
		if (this._measureStop) { return; }
		this._map.addLayer(marker);
		if (!this._measureStart) {
			this._measureStart = e.latlng;
			if (this._diStart) {
				marker.setIcon(this._diStart);
			}
			marker._pos = 0;
		} else  if (!this._measureStop) {
			this._measureStop = e.latlng;
			if (this._diEnd) {
				marker.setIcon(this._diEnd);
			}
			marker._pos = 1;
			
			//Do not worry, I decided to set this as the standard behaviour.
			//But you can change the style by setting your own class "lineClassName"
			this._measureLine = new L.Polyline([
				this._measureStart, e.latlng
			    ], { color: "black", opacity: 0.5, stroke: true });
			    
			this._map.addLayer(this._measureLine);
			this._measureLine._path.setAttribute("class", this.options['lineClassName']);

			var centerPos = new L.LatLng((this._measureStart.lat + this._measureStop.lat)/2, 
										 (this._measureStart.lng + this._measureStop.lng)/2);
			var distance = this._measureStart.distanceTo(this._measureStop);

			this.setContent(distance, centerPos);
			this._map.addLayer(this._distancePopup)
                         .fire('popupopen', { popup: this._distancePopup });
		}
		marker.on('drag', this._updateRuler, this);
		this._markerList.push(marker);
	},

	_updateRuler: function (e) {
		if (this._measureLine) {
			var target = e.target;
			var listLatng = this._measureLine.getLatLngs();
			listLatng[target._pos] = target.getLatLng();
			this._measureLine.setLatLngs(listLatng);

			var centerPos = new L.LatLng((listLatng[0].lat + listLatng[1].lat)/2, 
										 (listLatng[0].lng + listLatng[1].lng)/2);
			var distance = listLatng[0].distanceTo(listLatng[1]);

			this.setContent(distance, centerPos);
		}
	},

	setContent: function (distance, coord) {
		if (!this._distancePopup) {
			this._distancePopup = new L.Popup(this.options, this);
		}

		this._distancePopup.setContent("<b>Distance: </b></br>"+distance.toFixed(2)+"m.");
		this._distancePopup.setLatLng(coord);
	}
});
