const http = require("http");

let users = [
  { id: 1, name: "Ahmed", email: "ahmed@example.com" },
  { id: 2, name: "Mohamed", email: "mohamed@example.com" },
];

function sendJSON(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedURL = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedURL.pathname;

  // GET all users
  if (req.method === "GET" && pathname === "/users") {
    return sendJSON(res, 200, users);
  }

  // GET user by ID
  if (req.method === "GET" && pathname.startsWith("/users/")) {
    const id = Number(pathname.split("/")[2]);
    const user = users.find((u) => u.id === id);

    if (!user) {
      return sendJSON(res, 404, { message: "User Not Found" });
    }

    return sendJSON(res, 200, user);
  }

  // CREATE user
  if (req.method === "POST" && pathname === "/users") {
    try {
      const data = await getRequestBody(req);

      if (!data.name || !data.email) {
        return sendJSON(res, 400, {
          message: "Name and Email are required",
        });
      }

      const newUser = {
        id: Date.now(),
        name: data.name,
        email: data.email,
      };

      users.push(newUser);

      return sendJSON(res, 201, {
        message: "User Created Successfully",
        user: newUser,
      });
    } catch {
      return sendJSON(res, 400, { message: "Invalid JSON" });
    }
  }

  // UPDATE user (partial update)
  if (req.method === "PATCH" && pathname.startsWith("/users/")) {
    try {
      const id = Number(pathname.split("/")[2]);
      const user = users.find((u) => u.id === id);

      if (!user) {
        return sendJSON(res, 404, { message: "User Not Found" });
      }

      const data = await getRequestBody(req);

      if (data.name !== undefined) user.name = data.name;
      if (data.email !== undefined) user.email = data.email;

      return sendJSON(res, 200, {
        message: "User Updated Successfully",
        user,
      });
    } catch {
      return sendJSON(res, 400, { message: "Invalid JSON" });
    }
  }

  // DELETE user
  if (req.method === "DELETE" && pathname.startsWith("/users/")) {
    const id = Number(pathname.split("/")[2]);
    const index = users.findIndex((u) => u.id === id);

    if (index === -1) {
      return sendJSON(res, 404, { message: "User Not Found" });
    }

    const [deletedUser] = users.splice(index, 1);

    return sendJSON(res, 200, {
      message: "User Deleted Successfully",
      user: deletedUser,
    });
  }

  return sendJSON(res, 404, { message: "Route Not Found" });
});

server.listen(3000, () => {
  console.log("Users API running at http://localhost:3000");
});
