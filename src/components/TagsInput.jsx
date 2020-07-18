import React from 'react';

export default class TagsInput extends React.Component {
    constructor(props) {
        super(props);

        this.removeTag = (i) => {
            const newTags = [ ...this.props.tags ];
            newTags.splice(i, 1);
            this.props.onChange(newTags);
        }

        this.inputKeyDown = (e) => {
            const val = e.target.value;
            if (e.key === 'Enter' && val) {
                if (this.props.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
                    return;
                }
                this.props.onChange([...this.props.tags, val]);
                this.tagInput.value = null;
            } else if (e.key === 'Backspace' && !val) {
                this.removeTag(this.props.tags.length - 1);
            }
        }
    }

    render() {
        const { tags } = this.props;

        return (
            <div className="input-tag">
                <ul className="input-tag-list">
                    { tags.map((tag, i) => (
                        <li key={tag} className="input-tag-item" onClick={() => { this.removeTag(i); }}>
                            {tag}
                        </li>
                    ))}
                    <li className="input-tag-item input-tag-item-input-wrapper"><input type="text" onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} /></li>
                </ul>
            </div>
        );
    }
}
