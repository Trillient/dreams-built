const asyncHandler = require('express-async-handler');
const Client = require('../models/clientModel');

/**
 * @Desc Get a list of all Clients
 * @Route GET /api/clients
 * @Access Private (every user) //TODO - make private
 */

const getClients = asyncHandler(async (req, res) => {
  const clientList = await Client.find();
  res.json(clientList);
});

/**
 * @Desc Get a Client
 * @Route GET /api/clients/:id
 * @Access Private (every user) //TODO - make private
 */

const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  res.json(client);
});

/**
 * @Desc Create a new Client
 * @Route POST /api/clients
 * @Access Private (only admin) //TODO - make private
 */

const createClient = asyncHandler(async (req, res) => {
  const { clientName, contacts, color } = req.body;

  const checkClientExists = await Client.findOne({ clientName: clientName });

  if (checkClientExists) {
    res.status(400);
    throw new Error('Client already exists!');
  }

  const client = new Client({
    clientName: clientName,
    contacts: contacts,
    color: color,
  });

  const createdClient = await client.save();

  res.status(201).json(createdClient);
});

module.exports = { getClients, getClient, createClient };
