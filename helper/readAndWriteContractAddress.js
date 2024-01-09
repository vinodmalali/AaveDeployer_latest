const fs = require("fs");

module.exports.writeToFile = async function (newData) {
    try {
        // Read existing data from the file
        const existingData = await module.exports.readFromFile();

        // Merge the existing data with the new data
        const updatedData = { ...existingData, ...newData };

        // Write the updated data back to the file
        fs.writeFileSync("deployed-contracts.json", JSON.stringify(updatedData, null, 2));
    } catch (error) {
        console.error("Error writing to file:", error);
    }
}

module.exports.readFromFile = async function () {
    try {
        const rawData = fs.readFileSync("deployed-contracts.json");
        const jsonData = JSON.parse(rawData);
        return jsonData;
    } catch (error) {
        console.error("Error reading file:", error);
        return null;
    }
}

module.exports.getValueByKey = async function (key) {
    try {
        const jsonData = await module.exports.readFromFile();
        if (jsonData && jsonData[key] !== undefined) {
            return jsonData[key];
        } else {
            console.error("Key not found:", key);
            return null;
        }
    } catch (error) {
        console.error("Error getting value by key:", error);
        return null;
    }
}
