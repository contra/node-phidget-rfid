var items = {
  'AB4ATW7YAA==': {
    name: 'Heavy Duty Forks',
    description: '24 count',
    image: 'http://ecx.images-amazon.com/images/I/716g81hH-oL._SX355_.jpg',
    price: 1.50
  },
  'AB4ATX7bAA==': {
    name: 'Apricot Cashew Granola',
    description: '',
    image: 'http://mariahspleasingplates.com/wp-content/uploads/2015/03/apricot-cashew-granola-bar-1.jpg',
    price: 7.99
  }
};

var Cart = React.createFactory(React.createClass({
  render: function(){
    var tableItems = Object.keys(this.props.cart).map(function(itemId){
      var product = items[itemId];
      var image = React.DOM.td(null, React.DOM.img({
        src: product.image,
        className: 'checkout-item-image'
      }));
      var name = React.DOM.td(null, product.name);
      var price = React.DOM.td(null, product.price);
      return React.DOM.tr({
        className: 'checkout-item'
      }, image, name, price);
    });

    var tableHeader = React.DOM.thead(null,
      React.DOM.tr(null,
        React.DOM.th(null, 'Image'),
        React.DOM.th(null, 'Name'),
        React.DOM.th(null, 'Price')
      )
    );
    var table = React.DOM.table({
      className: 'pure-table'
    }, tableHeader, React.DOM.tbody(null, tableItems));
  }
}));

var Checkout = React.createFactory(React.createClass({
  render: function(){
    return React.DOM.div(null, 'Test Checkout');
  }
}));

var Application = React.createFactory(React.createClass({
  getInitialState: function(){
    return {
      cart: {},
      needsCheckout: false
    };
  },
  componentWillMount: function(){
    this.interval = setInterval(this.check, 1000);
  },
  check: function(){
    superagent.get('/status')
      .type('json')
      .end(function(err, res){
        if (err) return console.error(err);
        this.setState({
          cart: res.body.cart,
          needsCheckout: res.body.needsCheckout
        });
      }.bind(this));
  },
  render: function(){
    if (this.state.needsCheckout) {
      return Checkout({cart: this.state.cart});
    }
    return Cart({cart: this.state.cart});
  }
}));

React.render(Cart(), document.body);