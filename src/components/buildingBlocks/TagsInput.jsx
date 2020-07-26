import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import {withStyles} from "@material-ui/core";
import {DISPLAY_NAME_TO_TAG_KEY} from '../../utils/consts'

const styles = (theme) => ({
    tags: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    tag: {
        height: 27
    }
});



class TagsInput extends React.Component {
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
        const { tags, classes, chipColor: propsChipColor, isReadOnly = false } = this.props;

        const chipColor = propsChipColor || (isReadOnly ? undefined : 'primary')

        const last = _.last(tags)
        const tagListKey = last ? DISPLAY_NAME_TO_TAG_KEY[last] : 'root'
        const listId = `${tagListKey}-tag-list`

        return (
            <div className="input-tag">
                <ul className={classes.tags}>
                    { tags.map((tag, i) => (
                        <li key={tag} onClick={this.props.isReadOnly ? null : () => { this.removeTag(i); }}>
                            <Chip className={classes.tag} label={tag} color={chipColor}/>
                        </li>
                    ))}
                    {!this.props.isReadOnly && (
                        <li className="input-tag-item input-tag-item-input-wrapper"><input tabIndex={this.props.inputTabIndex} type="text" list={listId} onKeyDown={this.inputKeyDown} ref={c => { this.tagInput = c; }} /></li>
                    )}

                </ul>
            </div>
        );
    }
}

TagsInput.propTypes = {
    tags: PropTypes.array,
    onChange: PropTypes.func,
    isReadOnly: PropTypes.bool,
    inputTabIndex: PropTypes.number,
    chipColor: PropTypes.string,
    classes: PropTypes.object,
}

export default withStyles(styles)(TagsInput)
