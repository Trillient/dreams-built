const asyncHandler = require('express-async-handler');
const Client = require('../models/clientModel');

/**
 * @Desc Get a list of all Clients
 * @Route GET /api/clients
 * @Access Private ("read:clients" permission, Employee + Admin)
 */

const getClients = asyncHandler(async (req, res) => {
  const pageSize = +req.query.limit || 25;
  const page = +req.query.page || 1;

  const keyword = req.query.keyword
    ? {
        $and: [
          {
            $or: [
              {
                clientName: {
                  $regex: req.query.keyword,
                  $options: 'i',
                },
              },
              {
                'contact.name': {
                  $regex: req.query.keyword,
                  $options: 'i',
                },
              },
              {
                'contact.email': {
                  $regex: req.query.keyword,
                  $options: 'i',
                },
              },
            ],
          },
        ],
      }
    : {};

  const count = await Client.countDocuments({ ...keyword });
  const clientList = await Client.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ clientList, pages: Math.ceil(count / pageSize) });
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
  if (client) {
    res.json(client);
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

/**
 * @Desc Update a Client
 * @Route PUT /api/clients/:id
 * @Access Private ("write:clients" permission, Admin)
 */

const updateClient = asyncHandler(async (req, res) => {
  const { clientName, contact, color } = req.body;

  const client = await Client.findById(req.params.id);

  if (client) {
    client.clientName = clientName;
    client.color = color;
    client.contact = contact;

    const updatedClient = await client.save();
    res.json(updatedClient);
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

/**
 * @Desc Delete a Client
 * @Route DELETE /api/clients/:id
 * @Access Private ("write:clients" permission, Admin)
 */

const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);
  if (client) {
    client.remove();
    res.json({ message: 'client removed!' });
  } else {
    res.status(404);
    throw new Error('Client not found');
  }
});

module.exports = { getClients, getClient, createClient, updateClient, deleteClient };
