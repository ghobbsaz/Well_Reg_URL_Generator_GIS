// This code is for generating the URL to zoom to a well point.
// To run this code, run npm start

const encodeExBUrl = async (registryId) => {

  const baseUrl = `https://devwatermaps.azwater.gov/wellreg`;
  const dataLayer = "dataSource_14-18decfcb498-layer-10"
  const wkid = 26912 // UTM 12N
  const scale = 100000;


  let objectId;
  let x, y;  

  return await fetch(
    `https://services.arcgis.com/C34zQ7veRS0V1t04/ArcGIS/rest/services/Well_Registry_TEST/FeatureServer/0/query?where=registry_id%3D${registryId}&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=OBJECTID&returnHiddenFields=false&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson`
  )
    .then((res) => res.json())
    .then((obj) => {
      objectId = obj.features[0].attributes.OBJECTID;
      x = parseInt(obj.features[0].geometry.x.toFixed(1));
      y = parseInt(obj.features[0].geometry.y.toFixed(1));
    
      const center = `${x}%2C${y}%2C${wkid}`;
      const viewpointDetails = `center:${center},scale:${scale},rotation:0,viewpoint:`;

      const dataStr = `#data_s=id%3A${dataLayer}%3A${objectId}&widget_334=active_datasource_id:dataSource_14,`;
      const url = baseUrl + dataStr + viewpointDetails + getViewPointSyntax(x, y, wkid, scale);
      console.log(url)

    });

};


const getViewPointSyntax = (x, y, wkid, scale) => {

  // encoding for url
  const encodingDict = {
    "{": "%7B",
    "}": "%7D",
    ":": "%3A",
    ",": "%2C",
  };

  const viewpoint = {
    viewpoint: {
      rotation: 0,
      scale: scale,
      targetGeometry: {
        spatialReference: {
          wkid: wkid,
        },
        x: x,
        y: y,
      },
    },
  };

  const json = JSON.stringify(viewpoint);

  let viewpointUrlSyntax = json.split(`{"viewpoint":`)[1];

  viewpointUrlSyntax = viewpointUrlSyntax.substring(
    0,
    viewpointUrlSyntax.length - 1
  );

  viewpointUrlSyntax.split("").forEach((symbol) => {
    if (encodingDict[symbol]) {
      viewpointUrlSyntax = viewpointUrlSyntax.replace(
        symbol,
        encodingDict[symbol]
      );
    }
  });

  return viewpointUrlSyntax.replace(/\"/g,"");
}

const urlOutput = encodeExBUrl(
  528959 // registry_ID example
);
