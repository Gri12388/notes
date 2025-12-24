const PREFIX = "/api";

const req = (url, options = {}) => {
  const { body } = options;

  return fetch((PREFIX + url).replace(/\/\/$/, ""), {
    ...options,
    body: body ? JSON.stringify(body) : null,
    headers: {
      ...options.headers,
      ...(body
        ? {
            "Content-Type": "application/json",
          }
        : null),
    },
  }).then((res) =>
    res.ok
      ? res.json()
      : res.text().then((message) => {
          throw new Error(message);
        }),
  );
};

export const getNotes = ({ age, search, page } = {}) =>
  req("/notes", {
    method: "POST",
    body: {
      age,
      search,
      page,
    },
  });

export const createNote = (title, text) =>
  req("/create", {
    method: "POST",
    body: {
      title,
      text,
    },
  });

export const getNote = (id) => req(`/view/${id}`);

export const archiveNote = (id) => req(`/archive/${id}`);

export const unarchiveNote = (id) => req(`/unarchive/${id}`);

export const editNote = (id, title, text) =>
  req("/edit", {
    method: "POST",
    body: {
      id,
      title,
      text,
    },
  });

export const deleteNote = (id) => req(`/delete/${id}`);

export const deleteAllArchived = () => req(`/delete`);

export const notePdfUrl = (id) => {};
