var React = require('react');
var request = require('superagent');

var CreateForm = require('../components/CreateForm');
var EditForm = require('../components/EditForm');
var EditFormHeader = require('../components/EditFormHeader');

var Spinner = require('elemental').Spinner;

var View = React.createClass({
	
	displayName: 'ItemView',
	
	getInitialState: function() {
		return {
			createIsOpen: false,
			list: Keystone.list,
			itemData: null
		};
	},

	componentDidMount: function() {
		this.loadItemData();
	},

	loadItemData: function() {
		request.get('/keystone/api/' + Keystone.list.path + '/' + this.props.itemId + '?drilldown=true')
			.set('Accept', 'application/json')
			.end((err, res) => {
				if (err || !res.ok) {
					// TODO: nicer error handling
					console.log('Error loading item data:', res ? res.text : err);
					alert('Error loading data (details logged to console)');
					return;
				}
				this.setState({
					itemData: res.body
				});
			});
	},
	
	toggleCreate: function(visible) {
		this.setState({
			createIsOpen: visible
		});
	},
	
	renderCreateForm: function() {
		if (!this.state.createIsOpen) return null;
		return <CreateForm list={Keystone.list} isOpen={this.state.createIsOpen} onCancel={this.toggleCreate.bind(this, false)} />;
	},
	
	render: function() {
		if (!this.state.itemData) return <div className="view-loading-indicator"><Spinner /></div>;
		return (
			<div>
				<EditFormHeader list={this.state.list} data={this.state.itemData} drilldown={this.state.itemDrilldown} toggleCreate={this.toggleCreate} />
				<div className="container">
					{this.renderCreateForm()}
					<EditForm list={this.state.list} data={this.state.itemData} />
				</div>
			</div>
		);
	}
	
});

React.render(<View itemId={Keystone.itemId} />, document.getElementById('item-view'));
