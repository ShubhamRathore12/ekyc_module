// export function jsonToXml(jsonString: string, indent = "  "): string {
//   const json = JSON.parse(jsonString);

//   const xmlDoc = new DOMParser().parseFromString("<root></root>", "text/xml");
//   const rootElement = xmlDoc.documentElement;

//   function buildXml(parentNode: Element, data: any, level: number): void {
//     for (const [key, value] of Object.entries(data)) {
//       const element = xmlDoc.createElement(key);
//       parentNode.appendChild(element);

//       if (typeof value === "object" && value !== null) {
//         element.appendChild(xmlDoc.createTextNode("\n"));
//         buildXml(element, value, level + 1);
//         element.appendChild(xmlDoc.createTextNode("\n" + indent.repeat(level)));
//       } else {
//         element.textContent = String(value);
//       }
//     }
//   }

//   buildXml(rootElement, json, 0);

//   const xmlString = new XMLSerializer().serializeToString(xmlDoc);
//   const formattedXml = formatXml(xmlString, indent);

//   return formattedXml;
// }

// function formatXml(xml: string, indent = "  "): string {
//   const xmlDoc = new DOMParser().parseFromString(xml, "application/xml");
//   const xsltDoc = new DOMParser().parseFromString(
//     [
//       '<?xml version="1.0" encoding="UTF-8"?>',
//       `<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">`,
//       `<xsl:output method="xml" indent="yes"/>`,
//       `<xsl:template match="@*|node()">`,
//       `<xsl:copy>`,
//       `<xsl:apply-templates select="@*|node()"/>`,
//       `</xsl:copy>`,
//       `</xsl:template>`,
//       `</xsl:stylesheet>`,
//     ].join(""),
//     "application/xml"
//   );

//   const xsltProcessor = new XSLTProcessor();
//   xsltProcessor.importStylesheet(xsltDoc);

//   const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
//   const resultXml = new XMLSerializer().serializeToString(resultDoc);

//   return resultXml;
// }

export function jsonStrToXml(jsonStr: string): string {
  if (!jsonStr) return "";
  const json = JSON.parse(jsonStr);
  let xml = "";
  for (const [key, value] of Object.entries(json || {})) {
    if (typeof value === "object") {
      xml += `<${key}>${jsonStrToXml(JSON.stringify(value))}</${key}>\n`;
    } else {
      xml += `<${key}>${value}</${key}>\n`;
    }
  }
  return xml;
}
