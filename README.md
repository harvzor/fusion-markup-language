# Fusion Markup Language

> One *markup language* to rule them all, One *markup language* to find them, One *markup language* to bring them all and in the darkness bind them

## What?

Fusion Markup Language combines the most popular markup languages into one language:

```fml
{
  "person": {
    <name>
      firstName: "Harvey"
    </name>
  }
}
```

Fusion Markup Language allows you to embed `json`, `xml` and `yaml` in the same string, this new format is called **FML**.

## How?

Install FML:

```
npm install fml
```

Parse some `fml` in the same way as you would use `JSON.parse`:

```
const FML = require('fml')

const personObject = FML.parse(`
  <?xml version="1.0" encoding="UTF-8" ?>
  <person>
      {
          "name": {
              "firstName": "Rick",
              "lastName": "Astley"
          }
      }
  </person>
`)

console.log(personObject)
```

## Why?

When it comes to markup languages, developers are spoiled with choice:

- csv
- xml
- json
- yaml
- toml

It can be hard to decide which one to choose when starting with a project.

Fusion Markup Language attempts to provide a one-format-fits-all solution.
