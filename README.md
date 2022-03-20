# An Interior Design project management API server

A node API developed with `nestjs` to run the functionalities of
an app that allows interior design teams to keep track of their project's
progress.

Allows for the possibilty to create a team of designers who are able to create
projects with a kanban structure for following the progress. These projects
are connected to clients also created by the designers.

A basic chat is also provided among the members of the team.

Provides the admin of the team with an overview of all the projects currently
being worked on by their team.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

For the mongodb atlas connection:

-   `MONGO_USER`
-   `PASSWORD`
-   `DBNAME`
-   `TEST_DBNAME`

For jwt token signage and validation:

`SECRET`

## API Reference

### User endpoints

#### Register a new admin

```http
  POST /register
```

Accepts the following object structure passed as the body of the request:

```json
{
    "userName": "string",
    "name": "string",
    "password": "string",
    "userImage": "string",
    "mail": "sample@email.com"
}
```

Returns a jwt token that expires after two hours and includes the
admin's id and role as payload.

#### Create a new user

```http
  POST /users/new
```

Accepts the following object structure passed as the body of the request:

```json
{
    "userName": "string",
    "name": "string",
    "password": "string",
    "userImage": "string",
    "mail": "sample@email.com"
}
```

Returns the newly created user.

#### Login

```http
  POST /login/
```

Accepts the following object structure passed as the body of the request:

```json
{
    "userName": "string",
    "password": "string"
}
```

Returns a jwt token that expires after two hours and includes the
user's id and role as payload.

#### Get all users in the team

```http
  GET /users/
```

| Parameter       | Type        | Description               |
| :-------------- | :---------- | :------------------------ |
| `Authorization` | `jwt token` | **Required** Bearer token |

Returns an array of all users in the team only if the jwt token provided
is that of an admin user.

#### Get a user

```http
  GET /users/:id
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

Returns the user with the id provided as long as it is part of the team
of the user in the jwt token.

#### Update a user

```http
  PATCH /users/:id
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

Takes as body any number of updated properties of the user.

Returns the user with the id provided with the updated information.

#### Delete a user

```http
  PATCH /users/:id
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

Requires the jwt token to be that of an admin.
Returns the deleted user with the id provided.

### Project endpoints

#### Create a new project

```http
  POST /projects/new
```

| Parameter       | Type        | Description               |
| :-------------- | :---------- | :------------------------ |
| `Authorization` | `jwt token` | **Required** Bearer token |

Accepts the following object structure passed as the body of the request:

```json
{
    "title": "string",
    "description": "Project description for a new project",
    "client": "mongodb _id as string"
}
```

Saves a new project to the db, updates the user's projects to include it
and returns it.

#### Find all projects

```http
  GET /projects/
```

| Parameter       | Type        | Description               |
| :-------------- | :---------- | :------------------------ |
| `Authorization` | `jwt token` | **Required** Bearer token |

**If provided with admin token**
Returns an array of all projects created by users in their team.

**If provided with non admin token**
Returns an array of all projects created by the user.

#### Find a project

```http
  GET /projects/:id
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

**If provided with admin token**
Can access all projects created by users in their team.

**If provided with non admin token**
Can only access projects created by the user.

#### Update a project

```http
  PATCH /projects/:id
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

Takes as body any number of updated properties of the project.

**If provided with admin token**
Can update all projects created by users in their team.

**If provided with non admin token**
Can only update projects created by the user.

#### Delete a project

```http
  DELETE /projects/:id
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

**If provided with admin token**
Can delete all projects created by users in their team.

**If provided with non admin token**
Can only delete projects created by the user.

### Task endpoints

#### Create a new task

```http
  POST /tasks/:projectId
```

| Parameter       | Type        | Description               |
| :-------------- | :---------- | :------------------------ |
| `Authorization` | `jwt token` | **Required** Bearer token |

Accepts the following object structure passed as the body of the request:

```json
{
    "title": "Task title",
    "description": "Task description for a new task"
}
```

Saves a new task to the db, updates the user's project to include it
and returns the new task.

#### Find all tasks in a project

```http
  GET /tasks/:projectId
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `projectId`     | `mongodb _id` | **Required**              |

Returns an array of all tasks created within that project.

#### Find a task

```http
  GET /tasks/:projectId/:taskId
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `projectId`     | `mongodb _id` | **Required**              |
| `taskId`        | `mongodb _id` | **Required**              |

Returns the task with the id provided in the especified project.

#### Update a task

```http
  PATCH /tasks/:projectId/:taskId
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `projectId`     | `mongodb _id` | **Required**              |
| `taskId`        | `mongodb _id` | **Required**              |

Takes as body any number of updated properties of the task.

Returns the updated task.

#### Delete a task

```http
  DELETE /tasks/:projectId/:taskId
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `projectId`     | `mongodb _id` | **Required**              |
| `taskId`        | `mongodb _id` | **Required**              |

Returns the deleted task.

### Client endpoints

#### Create a new client

```http
  POST /clients/
```

| Parameter       | Type        | Description               |
| :-------------- | :---------- | :------------------------ |
| `Authorization` | `jwt token` | **Required** Bearer token |

Accepts the following object structure passed as the body of the request:

```json
{
    "name": "Client name",
    "address": {
        "street": "street name",
        "number": 32
    }
}
```

Saves a new client to the db and returns it.

#### Find all clients

```http
  GET /clients/
```

| Parameter       | Type        | Description               |
| :-------------- | :---------- | :------------------------ |
| `Authorization` | `jwt token` | **Required** Bearer token |

Returns an array of clients within the team.

#### Find a client

```http
  GET /client/:id
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

Returns the especified client.

#### Update a client

```http
  PATCH /clients/:id
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

Takes as body any number of updated properties of the project and returns
the updated client.

#### Delete a client

```http
  DELETE /clients/:id
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

Returns the deleted client.

### Chat endpoints

**Chats are created among the members of a team whenever a new user is added**

#### Find all chats

```http
  GET /chats/
```

| Parameter       | Type        | Description               |
| :-------------- | :---------- | :------------------------ |
| `Authorization` | `jwt token` | **Required** Bearer token |

Returns all chats that the user is a part of.

#### Find a chat

```http
  GET /chats/:chatId
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `Id`            | `mongodb _id` | **Required**              |

Returns the chat with the provided id as long as the user in the token is a part of it

#### Send a message

```http
  PATCH /clients/:chatId
```

| Parameter       | Type          | Description               |
| :-------------- | :------------ | :------------------------ |
| `Authorization` | `jwt token`   | **Required** Bearer token |
| `chatId`        | `mongodb _id` | **Required**              |

Accepts the following object structure passed as the body of the request:

```json
{
    "text": "message text"
}
```

Returns the chat with the new message added to the array of messages.
