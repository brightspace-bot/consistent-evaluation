# <%= name %>

[![NPM version](https://img.shields.io/npm/v/<%= packageName %>.svg)](https://www.npmjs.org/package/<%= packageName %>)
[![Greenkeeper badge](https://badges.greenkeeper.io/<%= githubOrg %>/<%= shortName %>.svg)](https://greenkeeper.io/)
[![Build status](https://travis-ci.com/<%= packageName %>.svg?branch=master)](https://travis-ci.com/<%= packageName %>)

<%= labsChecklist %><%= description %>

## Installation

To install from NPM:

```shell
npm install <%= packageName %>
```

## Usage

```html
<script type="module">
    import '<%= packageName %>/<%= shortName %>.js';
</script>
<<%= name %>>My element</<%= name %>>
```

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Running the demos

To start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo page and tests:

```shell
npm start
```

### Testing

To lint:

```shell
npm run lint
```

To run local unit tests:

```shell
npm run test:local
```

To run both linting and unit tests:

```shell
npm test
```

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version<%= readmeDeployment %>
