load('/docker-entrypoint-initdb.d/data.js');
db = db.getSiblingDB('dreamsBuiltAPI');
db.dreamsBuilt.insert(data);
