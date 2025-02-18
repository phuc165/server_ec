import { MongoClient } from "mongodb";
const URI = process.env.MONGO_URI;
const client = new MongoClient(URI);

async function connect() {
  // Use connect method to connect to the server
  await client.connect();
                        console.log("Connected successfully to server");
      return "done.";
}

connect()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());

export default connect;
