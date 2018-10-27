import shows from "./shows/shows";

module.exports = app => {
    app.use("/api/v1", shows);
}; /* end of module */