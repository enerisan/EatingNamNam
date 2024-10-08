const AbstractRepository = require("./AbstractRepository");

class RecipeLabelRepository extends AbstractRepository {
  constructor() {
    super({ table: "recipe_label" });
  }

  async create(recipeLabel) {
    const [result] = await this.database.query(
      `INSERT INTO ${this.table} (recipe_id, label_id) VALUES (?, ?)`,
      [recipeLabel.recipe_id, recipeLabel.label_id]
    );

    return result.insertId;
  }

  async read(id) {
    const [rows] = await this.database.query(
      `SELECT 
        rl.id, 
        r.id AS recipe_id, 
        r.name AS recipe_name, 
        r.image AS recipe_image, 
        r.date AS recipe_date,
        l.id AS label_id,
        l.name AS label_name
      FROM ${this.table} rl
      JOIN recipe r ON rl.recipe_id = r.id
      JOIN label l ON rl.label_id = l.id
      WHERE rl.id = ?
    `,
      [id]
    );

    return rows[0];
  }

  async readLabelsByRecipeId(recipeId) {
    const [rows] = await this.database.query(
      `SELECT 
         l.id AS label_id, 
         l.name AS label_name
       FROM ${this.table} rl
       JOIN label l ON rl.label_id = l.id
       WHERE rl.recipe_id = ?`,
      [recipeId]
    );

    return rows.map((row) => ({
      id: row.label_id,
      name: row.label_name,
    }));
  }

  async readAll() {
    const [rows] = await this.database.query(`
      SELECT 
        rl.id, 
        r.id AS recipe_id, 
        r.name AS recipe_name, 
        r.image AS recipe_image, 
        r.date AS recipe_date,
        l.id AS label_id, 
        l.name AS label_name
      FROM ${this.table} rl
      JOIN recipe r ON rl.recipe_id = r.id
      JOIN label l ON rl.label_id = l.id
      WHERE r.is_validated = true
    `);

    const recipes = [];

    rows.forEach((row) => {
      let recipe = recipes.find((r) => r.id === row.recipe_id);

      if (!recipe) {
        recipe = {
          id: row.recipe_id,
          name: row.recipe_name,
          image: row.recipe_image,
          date: row.recipe_date,
          labels: [],
        };
        recipes.push(recipe);
      }

      recipe.labels.push(row.label_name);
    });

    recipes.sort((a, b) => new Date(b.date) - new Date(a.date));
    return recipes;
  }

  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );

    return result;
  }

  async deleteByRecipeId(recipeId) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE recipe_id = ?`,
      [recipeId]
    );

    return result.affectedRows;
  }
}

module.exports = RecipeLabelRepository;
