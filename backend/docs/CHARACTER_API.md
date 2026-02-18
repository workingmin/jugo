# Character Management API

## Endpoints

### 1. Create Character
**POST** `/api/v1/works/:workId/characters`

Create a new character for a work.

**Request Body:**
```json
{
  "name": "张三",
  "role": "protagonist",
  "description": "主角，一个勇敢的年轻人"
}
```

**Response:**
```json
{
  "code": 201,
  "message": "Character created successfully",
  "data": {
    "characterId": 1,
    "workId": 1,
    "name": "张三",
    "role": "protagonist",
    "description": "主角，一个勇敢的年轻人",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 2. List Characters
**GET** `/api/v1/works/:workId/characters`

Get all characters for a work.

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "characters": [
      {
        "characterId": 1,
        "workId": 1,
        "name": "张三",
        "role": "protagonist",
        "description": "主角，一个勇敢的年轻人",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 3. Get Character
**GET** `/api/v1/characters/:id`

Get a specific character by ID.

**Response:**
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "characterId": 1,
    "workId": 1,
    "name": "张三",
    "role": "protagonist",
    "description": "主角，一个勇敢的年轻人",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### 4. Update Character
**PATCH** `/api/v1/characters/:id`

Update a character.

**Request Body:**
```json
{
  "name": "张三（更新）",
  "role": "protagonist",
  "description": "更新后的描述"
}
```

**Response:**
```json
{
  "code": 200,
  "message": "Character updated successfully",
  "data": {
    "characterId": 1,
    "workId": 1,
    "name": "张三（更新）",
    "role": "protagonist",
    "description": "更新后的描述",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:01Z"
  }
}
```

### 5. Delete Character
**DELETE** `/api/v1/characters/:id`

Delete a character.

**Response:**
```json
{
  "code": 200,
  "message": "Character deleted successfully",
  "data": null
}
```

## Character Roles

- `protagonist` - 主角
- `antagonist` - 反派
- `supporting` - 配角

## Authentication

All endpoints require JWT authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Error Responses

### 400 Bad Request
```json
{
  "code": 400,
  "message": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "code": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "code": 403,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "code": 404,
  "message": "Character not found"
}
```

### 500 Internal Server Error
```json
{
  "code": 500,
  "message": "Internal server error"
}
```
