import React from "react";

export function formatXml(xml: string): React.ReactNode {
  // Parse the XML string into an XMLDocument object
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xml, "text/xml");

  // Use XMLSerializer to convert the XMLDocument object back into a formatted string
  const serializer = new XMLSerializer();
  const formattedXml = serializer.serializeToString(xmlDoc);

  // Use dangerouslySetInnerHTML to render the formatted XML as JSX
  return formattedXml;
}
