import React from 'react';

export default class TagsInput extends React.Component {
    constructor() {
        super();

        this.state = {
            tags: [
                'קבוע',
                'חודשי'
            ]
        };

        this.removeTag = (i) => {
            const newTags = [ ...this.state.tags ];
            newTags.splice(i, 1);
            this.setState({ tags: newTags });
        }

        this.inputKeyDown = (e) => {
            const val = e.target.value;
            if (e.key === 'Enter' && val) {
                if (this.state.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
                    return;
                }
                this.setState({ tags: [...this.state.tags, val]});
                this.tagInput.value = null;
            } else if (e.key === 'Backspace' && !val) {
                this.removeTag(this.state.tags.length - 1);
            }
        }
    }

    render() {
        const { tags } = this.state;

        return (
            <div className="transaction-tags input-tag">
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
