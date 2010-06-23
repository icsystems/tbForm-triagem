//Author: Fernando Ferreira (fferreira@icsystems.com.br)
//June 22th, 2010

function parseXML( xml ) {
	if( window.ActiveXObject && window.GetObject ) {
		var dom = new ActiveXObject( 'Microsoft.XMLDOM' );
		dom.loadXML( xml );
		return dom;
	}
	if( window.DOMParser )
		return new DOMParser().parseFromString( xml, 'text/xml' );
	throw new Error( 'No XML parser available' );
}


jQuery.parseXML = function(xml){
	return jQuery(parseXML(xml));
}
