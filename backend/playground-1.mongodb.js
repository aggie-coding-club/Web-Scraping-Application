use("ws_app_db");
show("collections");
// db.scrapeconfigs.getIndexes();

// db.scrapeconfigs.createIndex({ timeToScrape: 1 });
// db.objs.createIndex({ configId: 1 });

// delete all documents in the corresponding collection
// DO NOT RUN THIS COMMAND OR ANYTHING SIMILAR UNLESS YOU KNOW WHAT YOU ARE DOING
// db.objs.deleteMany({});
// db.scrapeconfigs.deleteMany({});
// db.sessions.deleteMany({});
// db.users.deleteMany({});

// db.test_collection.drop();
// db.test_collection.deleteMany({});

// async function performPushOperation() {
//     await db.test_collection.insertOne({ _id: 1, array_field: [] });
//     for (let i = 0; i <= 1000; i++) {
//         const start = Date.now();
//         await db.test_collection.updateOne({ _id: 1 }, { $push: { array_field: i } });
//         const end = Date.now();

//         if (i % 100 === 0) {
//             console.log(`Iteration ${i}: Time taken = ${end - start} milliseconds`);
//         }
//     }
// }

// performPushOperation();

// Iteration 0: Time taken = 55 milliseconds
// Iteration 100: Time taken = 56 milliseconds
// Iteration 200: Time taken = 56 milliseconds
// Iteration 300: Time taken = 56 milliseconds
// Iteration 400: Time taken = 56 milliseconds
// Iteration 500: Time taken = 55 milliseconds
// Iteration 600: Time taken = 54 milliseconds
// Iteration 700: Time taken = 55 milliseconds
// Iteration 800: Time taken = 59 milliseconds
// Iteration 900: Time taken = 65 milliseconds
// Iteration 1000: Time taken = 57 milliseconds
