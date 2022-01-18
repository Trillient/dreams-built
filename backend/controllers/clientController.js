const asyncHandler = require('express-async-handler');
const Client = require('../models/clientModel');

/**
 * @Desc Get a list of all Clients
 * @Route GET /api/clients
 * @Access Private ("read:clients" permission, Employee + Admin)
 */

const getClients = asyncHandler(async (req, res) => {
  const clientList = await Client.find();
  res.json(clientList);
});

/**
 * @Desc Create a new Client
 * @Route POST /api/clients
 * @Access Private ("write:clients" permission, Admin)
 */

const createClient = asyncHandler(async (req, res) => {
  const { clientName, color, contact } = req.body;

  const checkClientExists = await Client.findOne({ clientName: clientName });

  if (checkClientExists) {
    res.status(400);
    throw new Error('Client already exists!');
  }

  const createdClient = await Client.create({
    clientName: clientName,
    color: color,
    contact: contact,
  });

  res.status(201).json({ message: 'Client created', client: createdClient });
});

/**
 * @Desc Get a Client
 * @Route GET /api/clients/:id
 * @Access Private ("read:clients" permission, Employee + Admin)
 */

const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  res.json(client);
});

/**
 * @Desc Update a Client
 * @Route PUT /api/clients/:id
 * @Access Private ("write:clients" permission, Admin)
 */

const updateClient = asyncHandler(async (req, res) => {
  const { clientName, contact, color } = req.body;

  const client = await Client.findById(req.params.id);

  client.clientName = clientName;
  client.color = color;
  client.contact = contact;

  const updatedClient = await client.save();
  res.json(updatedClient);
});

/**
 * @Desc Delete a Client
 * @Route DELETE /api/clients/:id
 * @Access Private ("write:clients" permission, Admin)
 */

const deleteClient = asyncHandler(async (req, res) => {
  await Client.findByIdAndRemove(req.params.id);
  res.json({ message: 'client removed!' });
});

module.exports = { getClients, getClient, createClient, updateClient, deleteClient };
