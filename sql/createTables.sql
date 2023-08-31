DROP TABLE IF EXISTS pasteBin;

CREATE TABLE  pasteBin (
    id          serial PRIMARY KEY,
    title       varchar(40) NOT NULL,
    body        text NOT NULL
);

INSERT INTO pasteBin (title,body) VALUES ('Console.log', 'console.log("hello")');

DROP TABLE IF EXISTS commentSubmit;

CREATE TABLE  commentSubmit (
    id          serial PRIMARY KEY,
    pasteBinId int,
    comment        text NOT NULL,
    FOREIGN KEY (pasteBinId) REFERENCES pasteBin(id),
);