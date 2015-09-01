var MainContent = React.createClass({
  getInitialState: function () {
    return ({
      page: 'CSS'
    })
  },
  render: function() {
    switch (this.state.page) {
      case 'CSS':
        return (<CourseSelection />)
    }
  }
});



var MainContainer = React.createClass({
  render: function() {
    return(
      <div id="MainContainer">
        <Navbar />
        <div className="content">
          <MainContent />
        </div>
      </div>
    );
  }
});


React.render(<MainContainer />, document.getElementsByTagName('body')[0]);
