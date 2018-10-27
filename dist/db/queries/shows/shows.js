import knex from "../../knex.js";

function Shows() {
  return knex("shows");
}

// *** CRUD *** //

export const getAll = () => {
  return Shows().select();
};

export const getSingle = id => {
  return Shows().where("id", parseInt(id)).first();
};

export const add = show => {
  return Shows().insert(show, "id");
};

export const update = (id, updates) => {
  return Shows().where("id", parseInt(id)).update(updates);
};

export const deleteItem = id => {
  return Shows().where("id", parseInt(id)).del();
};