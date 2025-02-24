import express from "express";
import { Sequelize, DataTypes } from "sequelize";
import cors from "cors";

const app = express();

// Middleware to parse JSON data and handle CORS
app.use(express.json());
app.use(cors());

// Set up MySQL connection using Sequelize
// Update the credentials ('Todo', 'root', 'your_password') as needed.
const sequelize = new Sequelize("todo", "root", "arush123", {
  host: "localhost",
  dialect: "mysql",
});

// Define the Todo model
const Todo = sequelize.define(
  "todo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "todos",
    timestamps: false,
  }
);

// Test the MySQL connection and sync the Todo model with the database
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connected");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database & tables synced");
  })
  .catch((err) => {
    console.error("MySQL connection error:", err);
  });

// Routes

// Root endpoint
app.get("/", (req, res) => {
  res.json("Hello, this is Arushan from backend");
});

// Create a new Todo
app.post("/todos", async (req, res) => {
  try {
    const newTodo = await Todo.create(req.body);
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single Todo by ID
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a Todo by ID
app.put("/todos/:id", async (req, res) => {
  try {
    const [updated] = await Todo.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const updatedTodo = await Todo.findByPk(req.params.id);
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a Todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const deleted = await Todo.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Todos by status
app.get("/todos/status/:status", async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { status: req.params.status },
    });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
