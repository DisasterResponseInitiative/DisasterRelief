
# Documentation for dri.js
dri.js is the core file for DisasterResponseInitiative.

## Methods
### GetData(urld, printHandler) 
For example : <b>GetData('data?transform=1', PlotMarker)</b>  or GetData('data?transform=1')
<br>
Here PlotMarker is a predefined handler function PlotMarker(...)
### PostData(urld, datain, getHandler)
For example :	<br>
		var json = {};	<br>
		json['title']=document.getElementById("title").value;<br>
		json['lat']=document.getElementById("lat").value;<br>
		json['lang']=document.getElementById("lang").value;<br>
		<b>PostData('data', json);</b>
    
### PlotMarker(data)
