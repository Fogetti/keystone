var React = require('react'),
	Field = require('../field'),
	// need jquery so we can get the markdown plugin to mount
	jQuery = require('jquery'),
	// scope our bootstrap-markdown plugin onto jquery
	Markdown = require('../../../public/js/lib/bootstrap-markdown/js/bootstrap-markdown.js');
	
module.exports = Field.create({
	
	supports: {
		width: true
	},
	
	componentDidMount: function() {
		var markdownOptions = {
			autofocus: false,
			savable: false,
			additionalButtons: this.buttonsToAdd(),
			reorderButtonGroups: ['groupFont', 'groupHeaders', 'groupLink', 'groupMisc', 'groupUtil']
		};

		// only have access to `refs` during componentDidMount
		$(this.refs.markdownTextarea.getDOMNode()).markdown(markdownOptions);
	},
	
	// Add all H1 to H6 buttons
	buttonsToAdd: function() {
		// Append/remove ### surround the selection 
		// Source: https://github.com/toopay/bootstrap-markdown/blob/master/js/bootstrap-markdown.js#L909
		var headingCallback = function (e, hType) {
			var chunk, cursor, selected = e.getSelection(), content = e.getContent(), pointer, prevChar;

			if (selected.length == 0) {
				// Give extra word
				chunk = e.__localize('heading text');
			} else {
				chunk = selected.text + '\n';
			}

			// transform selection and set the cursor into chunked text
			if ((pointer = hType.length+1, content.substr(selected.start-pointer,pointer) == hType+' ')
				|| (pointer = hType.length, content.substr(selected.start-pointer,pointer) == hType)) {
				e.setSelection(selected.start-pointer,selected.end);
				e.replaceSelection(chunk);
				cursor = selected.start-pointer;
			} else if (selected.start > 0 && (prevChar = content.substr(selected.start-1,1), !!prevChar && prevChar != '\n')) {
				e.replaceSelection('\n\n'+hType+' '+chunk);
				cursor = selected.start+hType.length+3;
			} else {
				// Empty string before element
				e.replaceSelection(hType+' '+chunk);
				cursor = selected.start+hType.length+1;
			}

			// Set the cursor
			e.setSelection(cursor,cursor+chunk.length);
		};
		
		return [{
			name: 'groupHeaders',
			data: [{
				name: 'cmdH1',
				title: 'Heading 1',
				btnText: 'H1',
				callback: function(e){
					headingCallback(e, '#');
				}
			},{
				name: 'cmdH2',
				title: 'Heading 2',
				btnText: 'H2',
				callback: function(e){
					headingCallback(e, '##');
				}
			},{
				name: 'cmdH3',
				title: 'Heading 3',
				btnText: 'H3',
				callback: function(e){
					headingCallback(e, '###');
				}
			},{
				name: 'cmdH4',
				title: 'Heading 4',
				btnText: 'H4',
				callback: function(e){
					headingCallback(e, '####');
				}
			},{
				name: 'cmdH5',
				title: 'Heading 5',
				btnText: 'H5',
				callback: function(e){
					headingCallback(e, '##');
				}
			},{
				name: 'cmdH6',
				title: 'Heading 6',
				btnText: 'H6',
				callback: function(e){
					headingCallback(e, '##');
				}
			}]
		}];
	},
	
	renderField: function() {
		return (
			<div className="md-editor">
				<textarea defaultValue={this.props.value.md} ref="markdownTextarea" className="form-control markdown code md-input"></textarea>
			</div>
		);
	}
});
