DROP TABLE IF EXISTS pasteBin;

CREATE TABLE  pasteBin (
    id          serial PRIMARY KEY,
    title       varchar(40) NOT NULL,
    body        text NOT NULL
);

INSERT INTO pasteBin (title,body) VALUES ('Console.log', 'console.log("hello")');