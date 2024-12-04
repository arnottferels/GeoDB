import { existsSync, mkdirSync, promises } from "fs";

async function main() {
  try {
    const fileName = "countries.json";
    const filePath = `./data/${fileName}`;
    const apiDir = "./api";

    // Ensure the file and output directory exist
    if (!existsSync(filePath))
      return console.log(`Error: ${fileName} file does not exist.`);
    if (!existsSync(apiDir)) mkdirSync(apiDir, { recursive: true });

    // Read and parse the JSON data
    const countries = JSON.parse(await promises.readFile(filePath, "utf8"));

    // Process each country
    await Promise.all(
      countries.map(async (countryData) => {
        const { id, country, capital } = countryData;
        if (id && country) {
          const countryData = { country, id, capital };

          // Stringify JSON and replace LF with CRLF
          let jsonString = JSON.stringify(countryData, null, 2);
          jsonString = jsonString.replace(/\n/g, "\r\n");

          // Write the file with CRLF line endings
          await promises.writeFile(`./api/${id}.json`, jsonString);
          console.log(`Created file for country: ${id}`);
        } else {
          console.warn("Invalid country structure:", countryData);
        }
      })
    );

    console.log("Processing complete.");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();