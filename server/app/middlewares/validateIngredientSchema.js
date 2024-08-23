const { z } = require("zod");

const ingredientSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Saissisez un nom d'ingrédient valide",
    })
    .min(2, {
      message: "Votre ingrédient doit contenir au minimum 2 caractères",
    })
    .regex(/^[A-Za-zÀ-ÖØ-ÿ\s]+$/, {
      message:
        "Le nom de l'ingrédient doit contenir uniquement des lettres et des espaces",
    }),

  category: z.string({
    invalid_type_error:
      "Saissisez une catégorie valide entre Fruit, Légume, Légumineuse, Produit laitier, Viande, Céréale, Épice, Fruit de mer/Poisson, Fruit à coque, Huile ",
  }),

  calories: z.number({
    invalid_type_error:
      "Entrez la quantitié de  calories pour 100 grammes de l'ingrédient ajouté",
  }),
  proteins: z.number({
    invalid_type_error:
      "Entrez la quantitié de  proteines pour 100 grammes de l'ingrédient ajouté",
  }),
  carbohydrates: z.number({
    invalid_type_error:
      "Entrez la quantitié de  carbohydrates pour 100 grammes de l'ingrédient ajouté",
  }),
  sugar: z.number({
    invalid_type_error:
      "Entrez la quantité de sucre pour 100 grammes de l'ingrédient ajouté",
  }),
  lipids: z.number({
    invalid_type_error:
      "Entrez la quantitié de  lipids pour 100 grammes de l'ingrédient ajouté",
  }),
  salt: z.number({
    invalid_type_error:
      "Entrez le nombre du sel pour 100 grammes de l'ingrédient ajouté",
  }),
  fiber: z.number({
    invalid_type_error:
      "Entrez la quantitié de  fibre pour 100 grammes de l'ingrédient ajouté",
  }),
});

const validateIngredientSchema = (req, res, next) => {
  const {
    name,
    category,
    calories,
    proteins,
    carbohydrates,
    sugar,
    lipids,
    salt,
    fiber,
  } = req.body;
  const validate = ingredientSchema.safeParse({
    name,
    category,
    calories,
    proteins,
    carbohydrates,
    sugar,
    lipids,
    salt,
    fiber,
  });

  if (!validate.success) {
    const errors = validate.error.issues.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {});

    return res.status(403).json(errors);
  }
  return next();
};

module.exports = validateIngredientSchema;
