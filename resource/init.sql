create table  if not exists iserverinfo (
    id integer primary key autoincrement,
    url text,
    username text,
    password text,
    token text
);