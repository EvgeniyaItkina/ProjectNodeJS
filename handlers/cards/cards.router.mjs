import { app } from "../../app.mjs";
import { Card } from "./cards.model.mjs";

// GET all cards
app.get("/cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving cards", error });
  }
});

// GET my cards (for authenticated users)
//ДОДЕЛАТЬ!!!!!!!!!!!!!!
app.get("/cards/my-cards", (req, res) => {
  res.send('');
});

// GET one card by id
app.get("/cards/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).send("Card not found");
    }
    res.send(card);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// POST create a new card (for authenticated users)
app.post("/cards", /* authenticate,  */async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      phone,
      email,
      image,
      address
    } = req.body;

    const card = new Card({
      title,
      subtitle,
      description,
      phone,
      email,
      image: {
        url: image.url,
        alt: image.alt,
      },
      address: {
        state: address.state,
        country: address.country,
        city: address.city,
        street: address.street,
        houseNumber: address.houseNumber,
        zip: address.zip,
      },
      /* owner: req.user._id // Предполагаем, что middleware добавляет `req.user` */
    });
    const newCard = await card.save();
    res.status(201).send(newCard);
  } catch (error) {
    res.status(500).send({ message: "Error creating card", error });
  }
});


// PUT update a card by id (for authenticated users)
app.put('/cards/:id', /* authenticate, */ async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      phone,
      email,
      image,
      address
    } = req.body;

    const card = await Card.findByIdAndUpdate(
      req.params.id,
      {
        title,
        subtitle,
        description,
        phone,
        email,
        image: {
          url: image.url,
          alt: image.alt,
        },
        address: {
          state: address.state,
          country: address.country,
          city: address.city,
          street: address.street,
          houseNumber: address.houseNumber,
          zip: address.zip,
        }
      },
      {
        new: true, // Returns the updated document instead of the old one
        runValidators: true // Forces the validation of the updated fields
      }
    );

    if (!card) {
      return res.status(404).send("Card not found");
    }
    res.send(card);
  } catch (error) {
    res.status(500).send({ message: "Error updating card", error });
  }
});

// PATCH update cards with likes
app.patch('/cards/:id', (req, res) => {
  res.send('');
});

// DELETE
app.delete("/cards/:id", /* authenticate, */ async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).send("Card not found");
    }
    res.send({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting card", error });
  }
});
