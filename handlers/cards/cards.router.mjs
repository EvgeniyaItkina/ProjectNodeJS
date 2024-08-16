import { app } from "../../app.mjs";
import { Card } from "./cards.model.mjs";
import { guard, businessGuard, adminGuard, getUser } from "../../middleware/guard.mjs";
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
app.get("/cards/my-cards", guard, async (req, res) => {
  try {
    const user = getUser(req);
    res.send(await Card.find({ user_id: user._id }));
  } catch (error) {
    res.status(500).send(error.message);
  }
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
app.post('/cards', guard, businessGuard, async (req, res) => {
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

    const user = getUser(req);

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
      user_id: user._id // ID владельца карточки
    });
    const newCard = await card.save();
    res.status(201).send(newCard);
  } catch (error) {
    res.status(500).send({ message: "Error creating card", error });
  }
});


// PUT update a card by id (for authenticated users)
app.put('/cards/:id', guard, async (req, res) => {
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

    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).send("Card not found");
    }

    // Проверка прав на изменение карточки
    const user = getUser(req);
    if (card.user_id.toString() !== user._id && !user.isAdmin) {
      return res.status(403).send({ message: "Unauthorized to update this card" });
    }

    card.title = title;
    card.subtitle = subtitle;
    card.description = description;
    card.phone = phone;
    card.email = email;
    card.image = { url: image.url, alt: image.alt };
    card.address = {
      state: address.state,
      country: address.country,
      city: address.city,
      street: address.street,
      houseNumber: address.houseNumber,
      zip: address.zip,
    };

    const updatedCard = await card.save();
    res.send(updatedCard);
  } catch (error) {
    res.status(500).send({ message: "Error updating card", error });
  }
});

// PATCH update cards with likes
app.patch('/cards/:id', guard, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      return res.status(404).send("Card not found");
    }
    const user = getUser(req);
    const userId = user._id;
    if (card.likes.includes(userId)) {
      card.likes = card.likes.filter(id => id.toString() !== userId);
    } else {
      card.likes.push(userId);
    }

    await card.save();
    res.send(card);
  } catch (error) {
    res.status(500).send({ message: "Error updating card likes", error });
  }
});

// DELETE
app.delete("/cards/:id", guard, async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.id);
    if (!card) {
      return res.status(404).send("Card not found");
    }

    // Проверка прав на удаление карточки
    const user = getUser(req);
    if (card.user_id.toString() !== user._id && !user.isAdmin) {
      return res.status(403).send({ message: "Unauthorized to delete this card" });
    }

    res.send({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error deleting card", error });
  }
});
