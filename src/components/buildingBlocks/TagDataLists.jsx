import React from 'react';
import {TAGS_DISPLAY_NAMES, TAGS_HIERARCHY} from "../../utils/consts";
import * as _ from "lodash";

class TagDataLists extends React.Component {
    render() {
        const getRecursiveTagDataList = () =>{
            const getTagDataList = (tagsHierarchy, idPrefix = 'root') => {
                const myDataList = (
                    <datalist id={`${idPrefix}-tag-list`} key={idPrefix}>
                        {_.keys(tagsHierarchy)
                            .map(tagKey => ({tagKey, tagName: TAGS_DISPLAY_NAMES[tagKey]}))
                            .map(({tagKey, tagName}) => (
                                <option key={tagKey}>{tagName}</option>
                            ))
                        }
                    </datalist>
                )

                const nextLevelDataList = _.values(_.mapValues(tagsHierarchy, (nextLevelTagsHierarchy, key) => _.isEmpty(nextLevelTagsHierarchy) ? [] : getTagDataList(nextLevelTagsHierarchy, key)))

                return [myDataList].concat(nextLevelDataList)
            }

            return getTagDataList(TAGS_HIERARCHY)
        }

        return (
            <React.Fragment>
                {getRecursiveTagDataList()}
            </React.Fragment>
        );
    }
}

export default TagDataLists;

