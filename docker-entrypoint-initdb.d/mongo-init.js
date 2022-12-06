db.createUser({
  user: process.env.MONGO_USERNAME,
  pwd: process.env.MONGO_PASSWORD,
  roles: [
    {
      role: "readWrite",
      db: process.env.MONGO_DB,
    },
  ],
});

db.createCollection("clients");

db.clients.insertMany([
  {
    username: "rfort",
    clientId: "2916a7b9-4e7a-4a07-af18-e8257bed16da",
    app: "coursera",
    clientSecret:
      "$2b$10$N1quSTJGYQEIMpp8R4apKONfzS3Mp8xFUgyH8NUkVcM9MlynBk.JK",
  },
]);

db.createCollection("courses");

db.courses.insertMany([
  {
    _id: "de47e08747364733ad6712f7",
    name: "Diplomatura Desarrollo Seguro de App - 2da. edición",
    initDate: "2022-08-20T03:00:00.000Z",
    enrolled: 25,
  },
  {
    _id: "4708ab93854c49efae38151d",
    name: "Diplomatura Desarrollo Seguro de App - 1da. edición",
    initDate: "2022-03-05T03:00:00.000Z",
    enrolled: 50,
  },
  {
    _id: "e3ade20f5dad45739fa19b92",
    name: "Diplomatura Desarrollo Seguro de App - 3ra. edición",
    initDate: "2023-03-05T03:00:00.000Z",
    enrolled: 0,
  },
]);

db.createCollection("tokens");

db.tokens.insertMany([
  {
    token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5iYXJyZXJhIiwiaWF0IjoxNjY5ODY3NTY2LCJleHAiOjE2Njk4Njc4NjZ9.mP6cRYUoyY7XQvFrPSpwylKQV8ttzNAYdonV5wZRPq4BSm9b9QRKiuYDBxlEiDwuFRcRFTPu-JOVO5ZmCXWnnanS3UydXceKmCdT7CHJHlIg7ayWrGrlLa58P8M7u9bFk2NVVeYWN890PDKu3-bVfuOXjPaQak-KGtfORrr_6JRXGNGST9EopCrAfpVQYN7orApIJ10yAIK_QgJGp6s0Q0ez4W_F9Iee--nueKxx25V9vKEv4OOFc9s9wwiSYXesTUckMB5xUZvjJwf1a0MB_MKh-VRUptLuJ8asC-OaVMsa4VC42e4DjLfUeeg32DBHjh_6DB-jq2FL3cw5L6Ti2lEAN17g6EWtP_jE1CiaxZhfODdZ-xiK09VSaNzDnMMkG8SfKtNoyLDAMdW8E-RlG-MkGxXpo_37-ius2Q9tRN2cPEyQRWW9NVjYmLXSYBWU7wg2XrNtoCM4kyFF1IOi-7RUPbBgkGt3AyEUX___PzwArLDsf8XxBxefsSuf7j7zSGAPLztDAjHSkNChmb5Ql6kUh7_NtzKzH7yMGHE1uH7sll3Jst-JtLY602Sh8jQEVeQkKziJbqmUtlFVL-K632eDGJR9cWeK9LSujK4ux3GYUF_WW0x-DY5f4zUdCwJxJbOv3zXxsw7RQo07KUCTwwX8aZD23DGp6RX0uMrRANo",
    username: "rfort",
    iat: 1669867566,
    exp: 1669867866,
  },
]);
db.createCollection("users");

db.users.insertMany([
  {
    _id: "1611d4cb6d0647c2a651b2b2",
    username: "rfort",
    password: "$2b$10$2jbjk2fZm9dIwkSfpTDKZuWYcOj4pMzEemIMwdtUNVq3IqvgJgVAa",
    name: "Ricardo",
    surname: "Fortunato",
    age: 39,
  },
]);
