
# Content Modeling
Create custom content types for your application by defining their structure and adding validations for each individual field.

## Content types

| Field       | Description | Default value | Required|
| ----------- | ----------- | -----   | ----    |
| `id` | Identifier of the content type. If a value is provided, it will always be formatted to camel case format. | It will take the value provided for the `name` but camel case format. e.g. Page = `page`. | false
| `name`   | What the Admin will display as the Name of the content type | | true
| `description`   | The description for the content type | empty | false
| `fields`   | Array of objects that will define each field available in the content type. e.g. <br/> `{ id: "age", name: "Age", description: "This is the user's age", type: "Number" }`. Please see the [**Field Definition**](#field-definition) table below for more information. | | true

<br/>

### Field definition

| Field      | Description | Default value | Required|
| ---------- | ----------- | ------- | ------- |
| `id` | Identifier of the field contained in the content type. It will be formatted to camel case. | | true
| `name`   | The label to be displayed in the Admin for the field | | true
| `description`   | Optional description for the field content type | empty | false
| `type`   | This will define the data-type for the field. It can be one of: `String` &#124; `Number` &#124; `Boolean` &#124; `Reference` (Link to another content type [coming soon]) | | true
| `isRequired` (coming soon)   | It will make the filed required if true | false | false

<br/>

## Content entries
A content entry can be considered an instance of a content type and you can **add as many content entries as you need**.

<br/>

## File structure
Content in the destination git Repository will initially follow the structure proposed below. This structure also be overriden using the `GIT_CONTENT_TYPES_FOLDER` and `GIT_CONTENT_FOLDER` environment variables.


    . # default root folder
    ├── content # default main content folder
        ├── contentTypeA # folder for all entries of type contentTypeA identified by an uuid
            ├── uuid-1.json
            ├── uuid-2.json
            ├── ...
            └── uuid-n.json.json

        └──  contentTypeB.json # folder for all entries of type contentTypeB identified by an uuid
            ├── uuid-1.json
            ├── uuid-2.json
            ├── ...
            └── uuid-n.json.json

    ├── contentTypes # default content types folder
        ├── contentTypeA.json # content type A information
        └── contentTypeB.json # content type B information

    └── README.md # will be added only if the repo was just created automatically
