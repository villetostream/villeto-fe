// function flattenObject(ob: any, prefix = "", result: any = {}): any {
//     for (const key in ob) {
//       if (Object.prototype.hasOwnProperty.call(ob, key)) {
//         const value = ob[key];
//         const newKey = prefix ? `${prefix}.${key}` : key;
//         if (value !== null && typeof value === "object") {
//           if (Array.isArray(value)) {
//             // For arrays, flatten each item with its index
//             value.forEach((item, index) => {
//               if (item !== null && typeof item === "object") {
//                 flattenObject(item, `${newKey}[${index}]`, result);
//               } else {
//                 result[`${newKey}[${index}]`] = item;
//               }
//             });
//           } else {
//             flattenObject(value, newKey, result);
//           }
//         } else {
//           result[newKey] = value;
//         }
//       }
//     }
//     return result;
//   }

//   // Function to export data as CSV. If filename isn't provided, it is generated based on the type.
//   export default function exportToCSV(
//     data: any,
//     type: string,
//     filename?: string
//   ) {
//     // Determine final filename based on type if not provided
//     const finalFileName =
//       filename ||
//       (type === "workOrder" ? "work order.csv" : `${type}.csv`);

//     let csvContent = "";
//     // Ensure data is an array
//     const dataArray = Array.isArray(data) ? data : [data];

//     // Flatten each item in the data array
//     const flatData = dataArray.map((item) => flattenObject(item));

//     // Collect all unique headers
//     const headersSet = new Set<string>();
//     flatData.forEach((item) => {
//       Object.keys(item).forEach((key) => headersSet.add(key));
//     });
//     const headers = Array.from(headersSet);
//     csvContent += headers.join(",") + "\n";

//     // Escape CSV values if needed
//     const escapeCSV = (value: any) => {
//       if (value === null || value === undefined) return "";
//       let str = String(value);
//       if (str.includes(",") || str.includes('"') || str.includes("\n")) {
//         str = '"' + str.replace(/"/g, '""') + '"';
//       }
//       return str;
//     };

//     // Create each row
//     flatData.forEach((item) => {
//       const row = headers.map((header) => escapeCSV(item[header])).join(",");
//       csvContent += row + "\n";
//     });

//     // Create a blob and trigger the download
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     const url = URL.createObjectURL(blob);
//     link.setAttribute("href", url);
//     link.setAttribute("download", finalFileName);
//     link.style.visibility = "hidden";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   }

//for exclusion of id
function flattenObject(ob: any, prefix = "", result: any = {}): any {
  for (const key in ob) {
    if (Object.prototype.hasOwnProperty.call(ob, key)) {
      // Ignore keys that include "id" (case-insensitive)
      if (key.toLowerCase().includes("id")) {
        continue;
      }
      const value = ob[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (value !== null && typeof value === "object") {
        if (Array.isArray(value)) {
          // For arrays, flatten each item with its index
          value.forEach((item, index) => {
            if (item !== null && typeof item === "object") {
              flattenObject(item, `${newKey}[${index}]`, result);
            } else {
              result[`${newKey}[${index}]`] = item;
            }
          });
        } else {
          flattenObject(value, newKey, result);
        }
      } else {
        result[newKey] = value;
      }
    }
  }
  return result;
}

// Function to export data as CSV. If filename isn't provided, it is generated based on the type.
export default function exportToCSV(
  data: any,
  type: string,
  filename?: string
) {
  console.log("ln118data", data)
  // Determine final filename based on type if not provided
  const finalFileName =
    filename || (type === "workOrder" ? "work order.csv" : `${type}.csv`);

  let csvContent = "";
  // Ensure data is an array
  const dataArray = Array.isArray(data) ? data : [data];
  console.log("dataArray", dataArray)

  // Flatten each item in the data array
  const flatData = dataArray.map((item) => flattenObject(item));
  console.log("flatData", flatData);

  // Collect all unique headers
  const headersSet = new Set<string>();
  flatData.forEach((item) => {
    Object.keys(item).forEach((key) => headersSet.add(key));
  });
  const headers = Array.from(headersSet);
  csvContent += headers.join(",") + "\n";

  // Escape CSV values if needed
  const escapeCSV = (value: any) => {
    if (value === null || value === undefined) return "";
    let str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      str = '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  // Create each row
  flatData.forEach((item) => {
    const row = headers.map((header) => escapeCSV(item[header])).join(",");
    csvContent += row + "\n";
  });

  // Create a blob and trigger the download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", finalFileName);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//alternative
// function flattenObject(ob: any, prefix = "", result: any = {}): any {
//   for (const key in ob) {
//     if (Object.prototype.hasOwnProperty.call(ob, key)) {
//       const value = ob[key];
//       const newKey = prefix ? `${prefix}.${key}` : key;
//       if (value !== null && typeof value === "object") {
//         // Instead of flattening further, store as a JSON string if it's not a plain object.
//         // Optionally, you could add logic here to decide when to flatten versus stringify.
//         result[newKey] = JSON.stringify(value);
//       } else {
//         result[newKey] = value;
//       }
//     }
//   }
//   return result;
// }

// // Function to export data as CSV. If filename isn't provided, it is generated based on the type.
// export default function exportToCSV(
//   data: any,
//   type: string,
//   filename?: string
// ) {
//   // Determine final filename based on type if not provided
//   const finalFileName =
//     filename || (type === "workOrder" ? "work order.csv" : `${type}.csv`);

//   let csvContent = "";
//   // Ensure data is an array
//   const dataArray = Array.isArray(data) ? data : [data];

//   // Flatten each item in the data array
//   const flatData = dataArray.map((item) => flattenObject(item));

//   // Collect all unique headers
//   const headersSet = new Set<string>();
//   flatData.forEach((item) => {
//     Object.keys(item).forEach((key) => headersSet.add(key));
//   });
//   const headers = Array.from(headersSet);
//   csvContent += headers.join(",") + "\n";

//   // Escape CSV values if needed
//   const escapeCSV = (value: any) => {
//     if (value === null || value === undefined) return "";
//     let str = String(value);
//     if (str.includes(",") || str.includes('"') || str.includes("\n")) {
//       str = '"' + str.replace(/"/g, '""') + '"';
//     }
//     return str;
//   };

//   // Create each row
//   flatData.forEach((item) => {
//     const row = headers.map((header) => escapeCSV(item[header])).join(",");
//     csvContent += row + "\n";
//   });

//   // Create a blob and trigger the download
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const link = document.createElement("a");
//   const url = URL.createObjectURL(blob);
//   link.setAttribute("href", url);
//   link.setAttribute("download", finalFileName);
//   link.style.visibility = "hidden";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }


// Helper to convert flattened keys into nested objects/arrays
export function unflatten(obj: Record<string, any>) {
  const result: Record<string, any> = {};

  for (const flatKey in obj) {
    const value = obj[flatKey];
    const segments = flatKey.split('.');
    let current = result;

    segments.forEach((segment, idx) => {
      const arrayMatch = segment.match(/^(.+)\[(\d+)\]$/);
      const isLast = idx === segments.length - 1;

      if (arrayMatch) {
        const key = arrayMatch[1];
        const index = parseInt(arrayMatch[2], 10);
        current[key] = current[key] || [];

        if (isLast) {
          current[key][index] = value;
        } else {
          current[key][index] = current[key][index] || {};
          current = current[key][index];
        }
      } else {
        // plain object key
        const key = segment;
        if (isLast) {
          current[key] = value;
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      }
    });
  }

  return result;
}
