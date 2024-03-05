// https://www.reddit.com/r/learnprogramming/comments/o50ai2/how_do_i_create_api_keys_for_my_api/
// https://stackoverflow.com/questions/14412132/whats-the-best-approach-for-generating-a-new-api-key
// https://blog.mergify.com/api-keys-best-practice/
// Make API key appear only once
// Store API keys directly in the database unhashed and with userId prefix, userId_apiKey

// const crypto = require('crypto');

// // Example function to hash an API key
// const hashApiKey = (apiKey) => {
//   return crypto.createHash('sha256').update(apiKey).digest('hex');
// }

// // Store the hash result instead of the original API key

// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Assuming the API key is stored in an environment variable
// const storedApiKey = process.env.MY_API_KEY;

// app.use((req, res, next) => {
//   const apiKey = req.get('X-API-Key');
//   if (!apiKey || apiKey !== storedApiKey) {
//     return res.status(401).json({ error: 'Invalid or missing API key' });
//   }
//   next(); // API key is valid; proceed to the next middleware/route handler
// });

// app.get('/my-secure-endpoint', (req, res) => {
//   res.json({ data: 'Access granted to secure data' });
// });

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
