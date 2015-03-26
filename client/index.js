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
      var image = React.DOM.td({
        style: {
          textAlign: 'center'
        }
      }, React.DOM.img({
        src: product.image,
        className: 'pure-img checkout-item-image',
        style: {
          padding: 5,
          maxWidth: 100
        }
      }));
      var name = React.DOM.td({
        style: {
          textAlign: 'center'
        }
      }, product.name);
      var price = React.DOM.td({
        style: {
          textAlign: 'center'
        }
      }, product.price);
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
    return React.DOM.table({
      className: 'pure-table',
      width: '100%'
    },
      tableHeader,
      React.DOM.tbody(null, tableItems)
    );
  }
}));

var Checkout = React.createFactory(React.createClass({
  render: function(){
    var total = Object.keys(this.props.cart).reduce(function(prev, itemId){
      return prev + items[itemId].price;
    }, 0);
    var header = React.DOM.h2({
      width: '100%',
      style: {
        padding: 50,
        textAlign: 'center'
      }
    }, 'You just paid $' + total);
    var audio = React.DOM.audio({
      src: 'hey-ya.wav',
      autoPlay: true
    });
    return React.DOM.div({
      width: '100%'
    }, header, audio);
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
    this.interval = setInterval(this.check, 100);
  },
  check: function(){
    superagent.get('/status')
      .type('json')
      .end(function(err, res){
        if (err) return console.error(err);
        this.setState({
          cart: res.body.cart,
          needsCheckout: res.body.checkout.needsCheckout
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

React.render(Application(), document.body);