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
  req("/list", {
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

export const getNote = (id) => req(`/${id}/view`);

export const archiveNote = (id) => req(`/${id}/archive`);

export const unarchiveNote = (id) => req(`/${id}/unarchive`);

export const editNote = (id, title, text) =>
  req("/edit", {
    method: "POST",
    body: {
      id,
      title,
      text,
    },
  });

export const deleteNote = (id) => req(`/${id}/delete`);

export const deleteAllArchived = () => req(`/purge`);

export const notePdfUrl = (id) => {};
