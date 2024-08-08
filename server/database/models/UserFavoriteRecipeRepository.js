const AbstractRepository = require("./AbstractRepository");

class UserFavoriteRecipeRepository extends AbstractRepository {
  constructor() {
    // Call the constructor of the parent class (AbstractRepository)
    // and pass the table name "item" as configuration
    super({ table: "user_favorite_recipe" });
  }

  // The C of CRUD - Create operation

  async create(userFavoriteRecipe) {
    // Execute the SQL INSERT query to add a new item to the "item" table
    const [result] = await this.database.query(
      `insert into ${this.table} ( user_id, recipe_id) values (?, ? )`,
      [userFavoriteRecipe.user_id, userFavoriteRecipe.recipe_id]
    );

    // Return the ID of the newly inserted item
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async readFavoritesByUserId(userId) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      `SELECT
      user_favorite_recipe.id AS favorite_id,
      recipe.id AS favorite_recipe_id,
         recipe.name AS favorite_name,
         recipe.image AS favorite_image
       FROM
         user_favorite_recipe
         JOIN recipe ON recipe.id = user_favorite_recipe.recipe_id
       WHERE
         user_favorite_recipe.user_id = ?`,
      [userId]
    );

    // Return the first row of the result, which represents the item
    return rows;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of items
    return rows;
  }

  // The U of CRUD - Update operation

  async update(userFavoriteRecipe) {
    const [result] = await this.database.query(
      `update ${this.table} set  user_id = ?, recipe_id = ? 
        WHERE id = ?`,
      [
        userFavoriteRecipe.user_id,
        userFavoriteRecipe.recipe_id,
        userFavoriteRecipe.id,
      ]
    );
    return result;
  }

  // The D of CRUD - Delete operation
  async delete(id) {
    const [result] = await this.database.query(
      `DELETE FROM ${this.table} WHERE id= ?`,
      [id]
    );
    return result;
  }
}

module.exports = UserFavoriteRecipeRepository;
