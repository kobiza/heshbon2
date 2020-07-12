import { TAGS_RECEIVED } from '../actions/actionTypes';

const initialState = [];

export default function eventsReducer(state = initialState, action = {}) {
    switch (action.type) {
        case TAGS_RECEIVED:
            return action.tags;
        default:
            return state;
    }
}
