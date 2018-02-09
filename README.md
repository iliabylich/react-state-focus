# React state focus

[![Build Status](https://travis-ci.org/iliabylich/react-state-focus.svg?branch=master)](https://travis-ci.org/iliabylich/react-state-focus)

### Install

NPM:
```
$ npm install --save react-state-focus
```

YARN:
```
$ yarn add react-state-focus
```

### Usage

1. Lens

That's a base class for all other classes in this package.
You can use it for example, for `propTypes` validation.

2. StateBoundLens

This class creates a lens for a part of component's state:

``` js
import { StateBoundLens } from 'react-state-focus';

// ... in your component
constructor() {
  this.state = { user: 1 }
  const lens = new StateBoundLens(this, 'user');
}

// .. that can be used later
console.log(this.lens.view());
// => 1
this.lens.set(2)
console.log(this.state.user)
// => 2
```

3. PropertyLens

This class creates an abstract lens that can be applied on `immutable` record
(or map, or absolutely anything that supports `[]` to get an attribute and `.set(prop, value)` to set)

``` js
import { Record } from 'immutable';
import { PropertyLens } from 'react-state-focus';

const User = Record({ email: '' });
const user = new User({ email: 'email@example.com' });

const emailLens = new PropertyLens('email');
emailLens.view(user)
// => 'email@example.com'
newUser = emailLens.set('new-email', user);
emailLens.view(newUser)
// => 'new-email'
```

4. LensChain

That's a class that does composition under the hood.

``` jsx
import { StateBoundLens, PropertyLens, LensChain } from 'react-state-focus';

class YourForm extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = { user: new User() };
    this.lens = new LensChain(
      new StateBoundLens(this, 'user')
    );
  }

  render() {
    const { lens } = this;

    return (
      <form>
        <EmailInput lens={lens.chain(new PropertyLens('email'))} />
        <ProfileInput lens={lens.chain(new PropertyLens('profile'))} />
      </form>
    );
  }
}
```

`EmailInput` may look like:

``` jsx
(props) =>
  <input type="text" value={props.lens.view()} onChange={(e) => props.lens.set(e.target.value)}
```

See `test.js` for more specific details.
Also a [demo repo](https://github.com/iliabylich/react-lens-forms/) is available.
