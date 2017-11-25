
## Documentation for dri.js
dri.js is the core file for DisasterResponseInitiative.

### Methods
#### GetData(urld, printHandler) 
For example : GetData('data?transform=1', PlotMarker)  or GetData('data?transform=1')
<br>
Here PlotMarker is a predefined handler function PlotMarker(...)
#### PostData(urld, datain, getHandler)
For example :	
		var json = {};	
		json['title']=document.getElementById("title").value;
		json['lat']=document.getElementById("lat").value;
		json['lang']=document.getElementById("lang").value;
		<b>PostData('data', json);</b>
    
#### PlotMarker(data)
