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

		this._measureLine = null;
		this._distancePopup = null;
		this._markerList = [];
		this._markerIcons = null;
		if (iconStart || iconEnd) {
			this._markerIcons = [iconStart, iconEnd];
		}
	},

	options: {
        minWidth: 50,
        autoPan: false,
        closeButton: false,
        className: 'measuring-label', /*css label class name*/
		lineClassName: 'measuring-line-class' /*css class name for the line*/
	},

	enable: function() {
		this._map.on('click', this._addMarker, this);
	},

	disable: function () {
		this._map.off('click', this._addMarker, this);

		if (this._distancePopup) {
			this._map.removeLayer(this._distancePopup);
			this._distancePopup = undefined;
		}
		if (this._measureLine) {
			this._map.removeLayer(this._measureLine);
			this._measureLine = undefined;
		}

		for (var i = 0; this._markerList.length; i++) {
			var marker = this._markerList.pop();
			marker.off('drag', this._updateRuler, this)
				  .off("click", this._showPopup, this);

			this._map.removeLayer(marker);
		}
	},

	_addMarker: function(e) {
		var markerPosition = this._markerList.length;
		if (markerPosition >= 2) {
			return;
		}

		var markerLocation = e.latlng;
		var marker = new L.Marker(markerLocation, {draggable:true});
		this._map.addLayer(marker);
		if (this._markerIcons && this._markerIcons[markerPosition]) {
			marker.setIcon(this._markerIcons[markerPosition]);
		}
		marker._pos = markerPosition;

		marker.on('drag', this._updateRuler, this);

		this._markerList.push(marker);
		this._setupLine();
		this._hookShowPopupEvent();
	},

	_setupLine: function() {
		if (this._markerList.length <= 1) {
			return;
		}
		var startLatLng = this._markerList[0].getLatLng()
			endLatLng = this._markerList[1].getLatLng();
		//Do not worry, I decided to set this as the standard behaviour.
		//But you can change the style by setting your own class "lineClassName"
		this._measureLine = new L.Polyline(
			[startLatLng, endLatLng ], 
			{ color: "black", opacity: 0.5, stroke: true });

		this._map.addLayer(this._measureLine);
		this._measureLine._path.setAttribute("class", this.options['lineClassName']);

		var centerPos = new L.LatLng((startLatLng.lat + endLatLng.lat)/2, 
									 (startLatLng.lng + endLatLng.lng)/2),
			distance = startLatLng.distanceTo(endLatLng);

		this.setContent(distance, centerPos);
		this._distancePopup.openOn(this._map);
	},

	_hookShowPopupEvent: function() {
		if (this._markerList.length <= 1) {
			return;
		}

		var _this = this;
		for(var i = 0; i < this._markerList.length; i++) {
			this._markerList[i].on("click", this._showPopup, this);
		}
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

	_showPopup: function() {
		this._distancePopup.openOn(this._map);
	},

	setContent: function (distance, coord) {
		if (!this._distancePopup) {
			this._distancePopup = new L.Popup(this.options, this);
		}

		this._distancePopup.setContent("<b>Distance: </b></br>"+distance.toFixed(2)+"m.");
		this._distancePopup.setLatLng(coord);
	},

	fire: function (fnName, params) {
		if (fnName) {
			console.log("fn called is: " + fnName);
			if (this[fnName]) {
				this[fnName](params);
			}
		}
	},

	popupopen: function(obj) {},
	popupclose: function(obj) {}
});
