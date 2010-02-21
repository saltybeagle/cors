/**
 * This is for Cross-site Origin Resource Sharing (CORS) requests.
 * 
 * Additionally the script will fail-over to a proxy if you have one set up.
 * 
 * @param string   url      the url to retrieve
 * @param mixed    data     data to send along with the get request [optional]
 * @param function callback function to call on successful result [optional]
 * @param string   type     the type of data to be returned [optional]
 */
function getCORS(url, data, callback, type) {
    try {
        // Try using jQuery to get data
        jQuery.get(url, data, callback, type);
    } catch(e) {
        // jQuery get() failed, try IE8 CORS, or use the proxy
        if (jQuery.browser.msie && window.XDomainRequest) {
            // Use Microsoft XDR
            var xdr = new XDomainRequest();
            xdr.open("get", url);
            xdr.onload = function() {
                callback(handleXDROnload(this, type), 'success', this);
            };
            xdr.send();
        } else {
            try {
                // Ancient browser, use our proxy
                var mycallback = function() {
                    var textstatus = 'error';
                    var data = 'error';
                    if ((this.readyState == 4)
                        && (this.status == '200')) {
                        textstatus = 'success';
                        data = this.responseText;
                    }
                    callback(data, textstatus);
                };
                // proxy_xmlhttp is a separate script you'll have to set up
                request = new proxy_xmlhttp();
                request.open('GET', url, true);
                request.onreadystatechange = mycallback;
                request.send();
            } catch(e) {
                // Could not fetch using the proxy
            }
        }
    }
}

/**
 * This method is for Cross-site Origin Resource Sharing (CORS) POSTs
 *
 * @param string   url      the url to post to
 * @param mixed    data     additional data to send [optional]
 * @param function callback a function to call on success [optional]
 * @param string   type     the type of data to be returned [optional]
 */
function postCORS(url, data, callback, type)
{
    try {
        // Try using jQuery to POST
        jQuery.post(url, data, callback, type);
    } catch(e) {
        // jQuery POST failed
        var params = '';
        for (key in data) {
            params = params+'&'+key+'='+data[key];
        }
        // Try XDR, or use the proxy
        if (jQuery.browser.msie && window.XDomainRequest) {
            // Use XDR
            var xdr = new XDomainRequest();
            xdr.open("post", url);
            xdr.send(params);
            xdr.onload = function() {
                callback(handleXDROnload(this, type), 'success', this);
            };
        } else {
            try {
                // Use the proxy to post the data.
                request = new proxy_xmlhttp();
                request.open('POST', url, true);
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                request.send(params);
            } catch(e) {
                // could not post using the proxy
            }
        }
    }
}

/**
 * Because the XDomainRequest object in IE does not handle response XML,
 * this function acts as an intermediary and will attempt to parse the XML and
 * return a DOM document.
 * 
 * @param XDomainRequest xdr  The XDomainRequest object
 * @param string         type The type of data to return
 * 
 * @return mixed 
 */
function handleXDROnload(xdr, type)
{
    var responseText = xdr.responseText, dataType = type || "";
    if (dataType.toLowerCase() == "xml"
        && typeof responseText == "string") {
        // If expected data type is xml, we need to convert it from a
        // string to an XML DOM object
        var doc;
        try {
            if (window.ActiveXObject) {
                doc = new ActiveXObject('Microsoft.XMLDOM');
                doc.async = 'false';
                doc.loadXML(responseText);
            } else {
                var parser = new DOMParser();
                doc = parser.parseFromString(responseText, 'text/xml');
            }
            return doc;
        } catch(e) {
            // ERROR parsing XML for conversion, just return the responseText
        }
    }
    return responseText;
}