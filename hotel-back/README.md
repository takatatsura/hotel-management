## TODO
Create Tests


## Server Configuration

Configure the **database** (look into the resource folder), the sql file was generated to use MySQL.

### Installing Dependencies

```bash
$ npm install
```

### Setting up

Inside src/config there's configuration environment variables, setup the database there.

### Running

To start the project, just run on your console
```bash
$ npm start
```

### Generate cert key files

Execute

```bash
openssl genrsa -out server.key 2048
openssl rsa -in server.key -out server.pem -outform PEM -pubout
```

Once you have the keys, move the generated files into keys/ folder.
