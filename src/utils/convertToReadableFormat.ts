export function convertToReadableFormat(input: string): string {
  // Remove escape characters from the input string
  if (!input) return "";
  const unescapedInput = input.replace(/\\/g, "");

  // Extract individual JSON objects from the input string
  const jsonObjects = unescapedInput.match(/{.*?}/g);

  if (!jsonObjects) {
    throw new Error("Invalid input string. No JSON objects found.");
  }

  // Convert each JSON object to a readable format
  const formattedData = jsonObjects.map((jsonStr: string) => {
    const obj = JSON.parse(jsonStr);
    const properties = Object.keys(obj);

    // Format each property of the object
    const formattedProperties = properties.map((prop: string) => {
      return `${prop}: ${obj[prop]}`;
    });

    // Join the formatted properties with a newline character
    return formattedProperties.join("\n");
  });

  // Join the formatted objects with a newline character
  return formattedData.join("\n");
}
